import { db } from '$lib/server/db';
import { legalPage } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import { audit } from '$lib/server/audit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

const LEGAL_PAGES = [
	{ slug: 'confidentialitate', label: 'Politica de Confidențialitate' },
	{ slug: 'gdpr', label: 'Conformitate GDPR' },
	{ slug: 'termeni', label: 'Termeni și Condiții' }
] as const;

const LOCALES = ['ro', 'en', 'bg'] as const;
const LOCALE_LABELS: Record<string, string> = { ro: 'Română', en: 'English', bg: 'Български' };

export const load: PageServerLoad = async ({ url }) => {
	const activeSlug = url.searchParams.get('pagina') || 'confidentialitate';
	const activeLocale = url.searchParams.get('limba') || 'ro';

	const rows = await db.select().from(legalPage);
	const content: Record<string, Record<string, { id: number; content: string; updatedAt: Date | null }>> = {};

	for (const row of rows) {
		if (!content[row.slug]) content[row.slug] = {};
		content[row.slug][row.locale] = {
			id: row.id,
			content: row.content,
			updatedAt: row.updatedAt
		};
	}

	return {
		pages: LEGAL_PAGES,
		locales: LOCALES,
		localeLabels: LOCALE_LABELS,
		content,
		activeSlug,
		activeLocale
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const form = await request.formData();
		const slug = form.get('slug') as string;
		const locale = form.get('locale') as string;
		const content = (form.get('content') as string)?.trim();

		if (!slug || !locale || !content) {
			return fail(400, { error: 'Toate câmpurile sunt obligatorii.' });
		}

		if (!LEGAL_PAGES.some(p => p.slug === slug)) {
			return fail(400, { error: 'Pagină invalidă.' });
		}

		const [existing] = await db
			.select()
			.from(legalPage)
			.where(and(eq(legalPage.slug, slug), eq(legalPage.locale, locale)))
			.limit(1);

		if (existing) {
			await db
				.update(legalPage)
				.set({ content, updatedAt: new Date() })
				.where(eq(legalPage.id, existing.id));
		} else {
			await db.insert(legalPage).values({ slug, locale, content });
		}

		const pageLabel = LEGAL_PAGES.find(p => p.slug === slug)?.label ?? slug;
		await audit({
			action: 'save',
			entity: 'legal',
			entityId: slug,
			details: { locale, page: pageLabel },
			user: locals.user
		});

		return { success: true, slug, locale };
	},

	translate: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const apiKey = env.ANTHROPIC_API_KEY;
		if (!apiKey) return fail(500, { error: 'Cheia API Anthropic nu este configurată.' });

		const form = await request.formData();
		const slug = form.get('slug') as string;
		const sourceLocale = form.get('sourceLocale') as string;
		const targetLocale = form.get('targetLocale') as string;

		if (!slug || !sourceLocale || !targetLocale) {
			return fail(400, { error: 'Parametri lipsă.' });
		}

		// Get source content
		const [source] = await db
			.select()
			.from(legalPage)
			.where(and(eq(legalPage.slug, slug), eq(legalPage.locale, sourceLocale)))
			.limit(1);

		if (!source) {
			return fail(400, { error: 'Conținutul sursă nu există.' });
		}

		const langNames: Record<string, string> = { ro: 'Romanian', en: 'English', bg: 'Bulgarian' };
		const fromName = langNames[sourceLocale] || sourceLocale;
		const toName = langNames[targetLocale] || targetLocale;

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
				system: `You are a professional legal translator for a Romanian law firm website. Translate the provided Markdown document from ${fromName} to ${toName}. Maintain the exact same Markdown structure (headings, lists, bold text). Maintain professional legal tone. Return ONLY the translated Markdown—no code blocks, no explanation, no wrapping.`,
				messages: [{ role: 'user', content: source.content }]
			})
		});

		if (!response.ok) {
			const errText = await response.text();
			console.error('Anthropic API error:', response.status, errText);
			return fail(500, { error: `Eroare API traducere: ${response.status}` });
		}

		const result = await response.json();
		const translated = result.content?.[0]?.text?.trim();
		if (!translated) return fail(500, { error: 'Răspuns gol de la AI.' });

		// Clean potential code block wrapping
		const cleaned = translated.replace(/^```(?:markdown)?\n?/, '').replace(/\n?```$/, '').trim();

		// Save translated content
		const [existing] = await db
			.select()
			.from(legalPage)
			.where(and(eq(legalPage.slug, slug), eq(legalPage.locale, targetLocale)))
			.limit(1);

		if (existing) {
			await db
				.update(legalPage)
				.set({ content: cleaned, updatedAt: new Date() })
				.where(eq(legalPage.id, existing.id));
		} else {
			await db.insert(legalPage).values({ slug, locale: targetLocale, content: cleaned });
		}

		const pageLabel = LEGAL_PAGES.find(p => p.slug === slug)?.label ?? slug;
		await audit({
			action: 'translate',
			entity: 'legal',
			entityId: slug,
			details: { from: sourceLocale, to: targetLocale, page: pageLabel },
			user: locals.user
		});

		return { translated: true, slug, locale: targetLocale };
	}
};
