import { db } from '$lib/server/db';
import { siteText } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import { getDefaultTranslations, locales, type Locale } from '$lib/i18n';
import { env } from '$env/dynamic/private';
import { createHash } from 'crypto';
import type { Actions, PageServerLoad } from './$types';

function hashText(text: string): string {
	return createHash('md5').update(text).digest('hex');
}

/** Section labels shown in the admin UI */
const sectionLabels: Record<string, string> = {
	nav: 'Navigare',
	hero: 'Hero (Banner Principal)',
	expertise: 'Domenii de Practică',
	results: 'Rezultate',
	about: 'Despre Cabinet',
	testimonials: 'Testimoniale',
	approach: 'Abordare',
	articleCards: 'Secțiune Articole',
	contact: 'Contact',
	footer: 'Footer',
	cookie: 'Cookie Consent',
	articles: 'Pagina Articole',
	articleDetail: 'Detaliu Articol',
	seo: 'SEO',
	legal: 'Legal',
	skipLink: 'Accesibilitate'
};

export const load: PageServerLoad = async ({ url }) => {
	const locale = (url.searchParams.get('limba') as Locale) || 'ro';

	const defaults = getDefaultTranslations(locale as Locale);
	const rows = await db.select().from(siteText).where(eq(siteText.locale, locale));
	const overrides: Record<string, string> = {};
	const sourceHashes: Record<string, string | null> = {};
	for (const row of rows) {
		overrides[row.key] = row.value;
		sourceHashes[row.key] = row.sourceHash;
	}

	// Group keys by section
	const sections: Record<string, { key: string; defaultValue: string; override: string | null; isAutoTranslated: boolean }[]> = {};
	for (const [key, defaultValue] of Object.entries(defaults)) {
		const section = key.split('.')[0];
		if (!sections[section]) sections[section] = [];
		sections[section].push({
			key,
			defaultValue,
			override: overrides[key] ?? null,
			isAutoTranslated: sourceHashes[key] != null
		});
	}

	// Count fields needing translation (only for non-ro locales)
	// A field needs translation only when:
	//   1. The RO text was customized via admin (has a DB override), AND
	//   2. Either the target has no DB override, or it was auto-translated
	//      from a different (stale) RO source.
	// If RO is still at its JSON default, the JSON translations are assumed correct.
	let pendingTranslations = 0;
	if (locale !== 'ro') {
		const roDefaults = getDefaultTranslations('ro');
		const roRows = await db.select().from(siteText).where(eq(siteText.locale, 'ro'));
		const roOverrides: Record<string, string> = {};
		for (const row of roRows) roOverrides[row.key] = row.value;

		for (const key of Object.keys(defaults)) {
			// Only consider keys where RO was customized in the DB
			if (roOverrides[key] === undefined) continue;

			const roValue = roOverrides[key];
			const currentHash = hashText(roValue);
			const existing = overrides[key];
			const existingSourceHash = sourceHashes[key];

			if (!existing) {
				// RO was customized but no target translation exists
				pendingTranslations++;
			} else if (existingSourceHash !== null && existingSourceHash !== currentHash) {
				// Auto-translated but source changed — needs re-translation
				pendingTranslations++;
			}
			// If existingSourceHash === null → manually edited, don't overwrite
		}
	}

	return { sections, sectionLabels, locale, locales, pendingTranslations };
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const formData = await request.formData();
		const locale = formData.get('locale')?.toString() || 'ro';
		const defaults = getDefaultTranslations(locale as Locale);

		const updates: { key: string; value: string }[] = [];
		const deletes: string[] = [];

		for (const key of Object.keys(defaults)) {
			const value = formData.get(`field:${key}`)?.toString();
			if (value === undefined || value === null) continue;

			const trimmed = value.trim();
			if (trimmed === '' || trimmed === defaults[key]) {
				// Matches default or empty — remove override if one exists
				deletes.push(key);
			} else {
				updates.push({ key, value: trimmed });
			}
		}

		// Delete removed overrides
		for (const key of deletes) {
			await db.delete(siteText).where(and(eq(siteText.key, key), eq(siteText.locale, locale)));
		}

		// Upsert changed values
		for (const { key, value } of updates) {
			const [existing] = await db
				.select()
				.from(siteText)
				.where(and(eq(siteText.key, key), eq(siteText.locale, locale)))
				.limit(1);

			if (existing) {
				await db
					.update(siteText)
					.set({ value, sourceHash: null, updatedAt: new Date() })
					.where(eq(siteText.id, existing.id));
			} else {
				await db.insert(siteText).values({ key, locale, value });
			}
		}

		return { success: true };
	},

	reset: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const formData = await request.formData();
		const key = formData.get('key')?.toString();
		const locale = formData.get('locale')?.toString() || 'ro';

		if (!key) return fail(400, { message: 'Cheie invalidă' });

		await db.delete(siteText).where(and(eq(siteText.key, key), eq(siteText.locale, locale)));
		return { success: true };
	},

	translate: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const apiKey = env.ANTHROPIC_API_KEY;
		if (!apiKey) return fail(500, { message: 'Cheia API Anthropic nu este configurată' });

		const formData = await request.formData();
		const targetLocale = formData.get('locale')?.toString() as Locale;
		if (!targetLocale || targetLocale === 'ro') return fail(400, { message: 'Limba țintă invalidă' });

		const langNames: Record<string, string> = { ro: 'Romanian', en: 'English', bg: 'Bulgarian' };
		const targetName = langNames[targetLocale] || targetLocale;

		// Get current RO values (override ?? default)
		const roDefaults = getDefaultTranslations('ro');
		const roRows = await db.select().from(siteText).where(eq(siteText.locale, 'ro'));
		const roOverrides: Record<string, string> = {};
		for (const row of roRows) roOverrides[row.key] = row.value;

		// Get existing target overrides
		const targetRows = await db.select().from(siteText).where(eq(siteText.locale, targetLocale));
		const targetOverrides: Record<string, string> = {};
		const targetSourceHashes: Record<string, string | null> = {};
		for (const row of targetRows) {
			targetOverrides[row.key] = row.value;
			targetSourceHashes[row.key] = row.sourceHash;
		}

		// Determine which fields need translation
		// Only translate fields where the RO text was customized via admin
		const toTranslate: Record<string, string> = {};
		const allKeys = Object.keys(getDefaultTranslations(targetLocale));

		for (const key of allKeys) {
			if (roOverrides[key] === undefined) continue;

			const roValue = roOverrides[key];
			const currentHash = hashText(roValue);
			const existing = targetOverrides[key];
			const existingSourceHash = targetSourceHashes[key];

			if (!existing) {
				toTranslate[key] = roValue;
			} else if (existingSourceHash !== null && existingSourceHash !== currentHash) {
				toTranslate[key] = roValue;
			}
		}

		if (Object.keys(toTranslate).length === 0) {
			return { translated: 0 };
		}

		// Call Claude to translate all fields at once
		const response = await fetch('https://api.anthropic.com/v1/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiKey,
				'anthropic-version': '2023-06-01'
			},
			body: JSON.stringify({
				model: 'claude-sonnet-4-20250514',
				max_tokens: 8192,
				system: `You are a professional legal translator for a Romanian law firm website. Translate the provided JSON object values from Romanian to ${targetName}. Maintain professional legal tone. Preserve any {placeholder} variables exactly as-is. Return ONLY valid JSON with the same keys and translated values—no code blocks, no explanation.`,
				messages: [
					{
						role: 'user',
						content: JSON.stringify(toTranslate)
					}
				]
			})
		});

		if (!response.ok) {
			const errText = await response.text();
			console.error('Anthropic API error:', response.status, errText);
			return fail(500, { message: `Eroare API traducere: ${response.status}` });
		}

		const result = await response.json();
		const text = result.content?.[0]?.text;
		if (!text) return fail(500, { message: 'Răspuns gol de la AI' });

		let translated: Record<string, string>;
		try {
			const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
			translated = JSON.parse(cleaned);
		} catch {
			return fail(500, { message: 'Răspunsul AI nu a putut fi procesat' });
		}

		// Save translated values with source_hash
		let count = 0;
		for (const [key, value] of Object.entries(translated)) {
			if (!(key in toTranslate)) continue;
			const roValue = toTranslate[key];
			const hash = hashText(roValue);

			const [existing] = await db
				.select()
				.from(siteText)
				.where(and(eq(siteText.key, key), eq(siteText.locale, targetLocale)))
				.limit(1);

			if (existing) {
				await db
					.update(siteText)
					.set({ value, sourceHash: hash, updatedAt: new Date() })
					.where(eq(siteText.id, existing.id));
			} else {
				await db.insert(siteText).values({ key, locale: targetLocale, value, sourceHash: hash });
			}
			count++;
		}

		return { translated: count };
	}
};
