import { db } from '$lib/server/db';
import { siteText, siteTextHistory, siteConfig } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import { getDefaultTranslations, locales, type Locale } from '$lib/i18n';
import { env } from '$env/dynamic/private';
import { createHash } from 'crypto';
import { audit } from '$lib/server/audit';
import type { Actions, PageServerLoad } from './$types';

function hashText(text: string): string {
	return createHash('md5').update(text).digest('hex');
}

async function archiveField(key: string, locale: string, changeType: string) {
	const [current] = await db
		.select()
		.from(siteText)
		.where(and(eq(siteText.key, key), eq(siteText.locale, locale)))
		.limit(1);
	if (current) {
		await db.insert(siteTextHistory).values({
			key,
			locale,
			value: current.value,
			sourceHash: current.sourceHash,
			changeType
		});
	}
}

/** Page → section mapping */
const pageDefinitions: { id: string; label: string; sections: string[] }[] = [
	{
		id: 'main',
		label: 'Pagina Principală',
		sections: ['hero', 'expertise', 'results', 'about', 'testimonials', 'approach', 'articleCards', 'contact']
	},
	{
		id: 'despre',
		label: 'Despre Mine',
		sections: ['aboutPage']
	},
	{
		id: 'articole',
		label: 'Articole',
		sections: ['articles', 'articleDetail']
	},
	{
		id: 'global',
		label: 'Global',
		sections: ['nav', 'footer', 'seo', 'cookie', 'legal', 'skipLink']
	}
];

const sectionLabels: Record<string, string> = {
	nav: 'Navigare',
	hero: 'Hero (Banner Principal)',
	expertise: 'Domenii de Practică',
	results: 'Statistici & Rezultate',
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
	skipLink: 'Accesibilitate',
	aboutPage: 'Pagina Despre Mine'
};

/** Fields that should render as long text (textarea) */
const longTextFields = new Set([
	'hero.description', 'expertise.description', 'results.description',
	'about.p1', 'about.p2', 'about.p3',
	'aboutPage.bio1', 'aboutPage.bio2', 'aboutPage.bio3',
	'aboutPage.philosophy1', 'aboutPage.philosophy2', 'aboutPage.seoDesc',
	'contact.addressValue', 'contact.description',
	'footer.brand', 'cookie.text',
	'articles.pageDescription', 'articles.description',
	'articleDetail.authorBio', 'articleDetail.ctaDescription',
	'seo.defaultDescription', 'approach.step1Desc', 'approach.step2Desc',
	'approach.step3Desc', 'approach.step4Desc', 'approach.description',
	'testimonials.description', 'articleCards.description',
	'legal.privacySeoDesc', 'legal.gdprSeoDesc', 'legal.termsSeoDesc'
]);

/** Fields that are stat values — shown in global stats panel */
const statFields = new Set([
	'results.casesValue', 'results.rateValue', 'results.yearsValue', 'results.recoveredValue'
]);

/** Stat title/label fields — shown alongside values in stats panel */
const statTitleFields = new Set([
	'results.cases', 'results.rate', 'results.years', 'results.recovered'
]);

/** Expertise text fields — shown in expertise editing panel */
const expertiseTextFields = new Set([
	'expertise.civil', 'expertise.civilDesc',
	'expertise.commercial', 'expertise.commercialDesc',
	'expertise.family', 'expertise.familyDesc',
	'expertise.realestate', 'expertise.realestateDesc',
	'expertise.labor', 'expertise.laborDesc',
	'expertise.criminal', 'expertise.criminalDesc'
]);

/** About text fields — shown as combined textareas */
const aboutTextFields = new Set([
	'about.p1', 'about.p2', 'about.p3',
	'aboutPage.bio1', 'aboutPage.bio2', 'aboutPage.bio3',
	'aboutPage.philosophy1', 'aboutPage.philosophy2'
]);

/** Friendly field labels */
const fieldLabels: Record<string, string> = {
	// Hero
	'hero.label': 'Etichetă secțiune',
	'hero.title': 'Titlu principal',
	'hero.description': 'Descriere',
	'hero.ctaPrimary': 'Buton principal',
	'hero.ctaSecondary': 'Buton secundar',
	'hero.statYears': 'Etichetă ani experiență',
	'hero.statCases': 'Etichetă cazuri finalizate',
	'hero.statRate': 'Etichetă rată succes',
	// Results / Stats
	'results.label': 'Etichetă secțiune',
	'results.title': 'Titlu secțiune',
	'results.description': 'Descriere secțiune',
	'results.cases': 'Etichetă — cazuri',
	'results.rate': 'Etichetă — rată succes',
	'results.years': 'Etichetă — ani experiență',
	'results.recovered': 'Etichetă — valoare recuperată',
	'results.casesValue': 'Număr cazuri',
	'results.rateValue': 'Rată succes',
	'results.yearsValue': 'Ani experiență',
	'results.recoveredValue': 'Valoare recuperată',
	// Expertise
	'expertise.label': 'Etichetă secțiune',
	'expertise.title': 'Titlu secțiune',
	'expertise.description': 'Descriere secțiune',
	'expertise.ctaButton': 'Text buton CTA',
	'expertise.civil': 'Drept Civil — titlu',
	'expertise.civilDesc': 'Drept Civil — descriere',
	'expertise.commercial': 'Drept Comercial — titlu',
	'expertise.commercialDesc': 'Drept Comercial — descriere',
	'expertise.family': 'Dreptul Familiei — titlu',
	'expertise.familyDesc': 'Dreptul Familiei — descriere',
	'expertise.realestate': 'Drept Imobiliar — titlu',
	'expertise.realestateDesc': 'Drept Imobiliar — descriere',
	'expertise.labor': 'Dreptul Muncii — titlu',
	'expertise.laborDesc': 'Dreptul Muncii — descriere',
	'expertise.criminal': 'Drept Penal — titlu',
	'expertise.criminalDesc': 'Drept Penal — descriere',
	// About
	'about.label': 'Etichetă secțiune',
	'about.title': 'Titlu secțiune',
	'about.p1': 'Paragraf 1',
	'about.p2': 'Paragraf 2',
	'about.p3': 'Paragraf 3',
	'about.credentialsTitle': 'Titlu calificări',
	'about.cred1': 'Calificare 1',
	'about.cred2': 'Calificare 2',
	'about.cred3': 'Calificare 3',
	'about.cred4': 'Calificare 4',
	'about.ctaButton': 'Text buton CTA',
	// Testimonials
	'testimonials.label': 'Etichetă secțiune',
	'testimonials.title': 'Titlu secțiune',
	'testimonials.description': 'Descriere secțiune',
	// Approach
	'approach.label': 'Etichetă secțiune',
	'approach.title': 'Titlu secțiune',
	'approach.description': 'Descriere secțiune',
	'approach.step1Title': 'Pasul 1 — titlu',
	'approach.step1Desc': 'Pasul 1 — descriere',
	'approach.step2Title': 'Pasul 2 — titlu',
	'approach.step2Desc': 'Pasul 2 — descriere',
	'approach.step3Title': 'Pasul 3 — titlu',
	'approach.step3Desc': 'Pasul 3 — descriere',
	'approach.step4Title': 'Pasul 4 — titlu',
	'approach.step4Desc': 'Pasul 4 — descriere',
	// Article Cards
	'articleCards.label': 'Etichetă secțiune',
	'articleCards.title': 'Titlu secțiune',
	'articleCards.description': 'Descriere secțiune',
	'articleCards.readMore': 'Text „citește mai mult"',
	'articleCards.viewAll': 'Text „vezi toate"',
	'articleCards.imageAlt': 'Alt imagine implicit',
	// Contact
	'contact.label': 'Etichetă secțiune',
	'contact.title': 'Titlu secțiune',
	'contact.description': 'Descriere secțiune',
	'contact.address': 'Etichetă adresă',
	'contact.addressValue': 'Adresă completă',
	'contact.phone': 'Etichetă telefon',
	'contact.email': 'Etichetă email',
	'contact.mapTitle': 'Titlu hartă',
	// Footer
	'footer.brand': 'Text brand',
	'footer.navTitle': 'Titlu navigare',
	'footer.aboutCabinet': 'Link „Despre Cabinet"',
	'footer.servicesTitle': 'Titlu servicii',
	'footer.legalTitle': 'Titlu legal',
	'footer.privacy': 'Link confidențialitate',
	'footer.terms': 'Link termeni',
	'footer.gdpr': 'Link GDPR',
	'footer.copyright': 'Text copyright',
	// Cookie
	'cookie.text': 'Mesaj cookie',
	'cookie.privacyLink': 'Text link confidențialitate',
	'cookie.gdprLink': 'Text link GDPR',
	'cookie.accept': 'Buton accept',
	'cookie.decline': 'Buton refuză',
	// Nav
	'nav.home': 'Acasă',
	'nav.expertise': 'Expertiza',
	'nav.about': 'Despre',
	'nav.articles': 'Articole',
	'nav.contact': 'Contact',
	// SEO
	'seo.defaultTitle': 'Titlu SEO implicit',
	'seo.defaultDescription': 'Descriere SEO implicită',
	// Legal
	'legal.breadcrumbHome': 'Breadcrumb acasă',
	'legal.lastUpdated': 'Data actualizării',
	'legal.privacyTitle': 'Titlu confidențialitate',
	'legal.privacySeoDesc': 'SEO descriere confidențialitate',
	'legal.gdprTitle': 'Titlu GDPR',
	'legal.gdprSeoDesc': 'SEO descriere GDPR',
	'legal.termsTitle': 'Titlu termeni',
	'legal.termsSeoDesc': 'SEO descriere termeni',
	// Skip link
	'skipLink': 'Text salt la conținut',
	// Articles page
	'articles.pageTitle': 'Titlu pagină',
	'articles.pageDescription': 'Descriere SEO',
	'articles.breadcrumbHome': 'Breadcrumb acasă',
	'articles.breadcrumbArticles': 'Breadcrumb articole',
	'articles.heading': 'Titlu principal',
	'articles.description': 'Descriere',
	'articles.all': 'Filtra — toate',
	'articles.noArticles': 'Mesaj gol',
	'articles.readArticle': 'Text „citește articolul"',
	'articles.prevPage': 'Paginare — înapoi',
	'articles.nextPage': 'Paginare — înainte',
	'articles.pageOf': 'Paginare — pagina X din Y',
	'articles.minRead': 'Text „min lectură"',
	// Article Detail
	'articleDetail.breadcrumbArticle': 'Breadcrumb articol',
	'articleDetail.authorName': 'Nume autor',
	'articleDetail.authorRole': 'Rol autor',
	'articleDetail.authorBio': 'Bio autor',
	'articleDetail.tags': 'Etichetă tag-uri',
	'articleDetail.relatedLabel': 'Etichetă articole conexe',
	'articleDetail.relatedTitle': 'Titlu articole conexe',
	'articleDetail.ctaTitle': 'Titlu CTA',
	'articleDetail.ctaDescription': 'Descriere CTA',
	'articleDetail.ctaButton': 'Buton CTA',
	'articleDetail.availableIn': 'Text „disponibil în"',
	// About page
	'aboutPage.breadcrumbHome': 'Breadcrumb acasă',
	'aboutPage.breadcrumbAbout': 'Breadcrumb despre',
	'aboutPage.seoTitle': 'Titlu SEO',
	'aboutPage.seoDesc': 'Descriere SEO',
	'aboutPage.label': 'Etichetă secțiune',
	'aboutPage.title': 'Titlu principal',
	'aboutPage.subtitle': 'Subtitlu',
	'aboutPage.bio1': 'Biografie — paragraf 1',
	'aboutPage.bio2': 'Biografie — paragraf 2',
	'aboutPage.bio3': 'Biografie — paragraf 3',
	'aboutPage.philosophyTitle': 'Titlu filosofie',
	'aboutPage.philosophy1': 'Filosofie — paragraf 1',
	'aboutPage.philosophy2': 'Filosofie — paragraf 2',
	'aboutPage.credentialsTitle': 'Titlu calificări',
	'aboutPage.cred1': 'Calificare 1',
	'aboutPage.cred2': 'Calificare 2',
	'aboutPage.cred3': 'Calificare 3',
	'aboutPage.cred4': 'Calificare 4',
	'aboutPage.ctaTitle': 'Titlu CTA',
	'aboutPage.ctaDescription': 'Descriere CTA',
	'aboutPage.ctaButton': 'Buton CTA'
};

export const load: PageServerLoad = async ({ url }) => {
	const locale = (url.searchParams.get('limba') as Locale) || 'ro';
	const activePage = url.searchParams.get('pagina') || 'main';

	const defaults = getDefaultTranslations(locale as Locale);
	const rows = await db.select().from(siteText).where(eq(siteText.locale, locale));
	const overrides: Record<string, string> = {};
	const sourceHashes: Record<string, string | null> = {};
	for (const row of rows) {
		overrides[row.key] = row.value;
		sourceHashes[row.key] = row.sourceHash;
	}

	const historyRows = await db
		.select()
		.from(siteTextHistory)
		.where(eq(siteTextHistory.locale, locale));
	const historyCounts: Record<string, number> = {};
	for (const row of historyRows) {
		historyCounts[row.key] = (historyCounts[row.key] ?? 0) + 1;
	}

	// Find the active page definition
	const pageDef = pageDefinitions.find((p) => p.id === activePage) ?? pageDefinitions[0];
	const activeSections = new Set(pageDef.sections);

	// Group keys by section, filtered to active page
	type FieldInfo = {
		key: string;
		defaultValue: string;
		override: string | null;
		isAutoTranslated: boolean;
		historyCount: number;
		isLongText: boolean;
		friendlyLabel: string | null;
		isStat: boolean;
		isStatTitle: boolean;
		isExpertiseText: boolean;
		isAboutText: boolean;
	};
	const sections: Record<string, FieldInfo[]> = {};
	for (const [key, defaultValue] of Object.entries(defaults)) {
		const section = key.split('.')[0];
		if (!activeSections.has(section)) continue;
		if (!sections[section]) sections[section] = [];
		sections[section].push({
			key,
			defaultValue,
			override: overrides[key] ?? null,
			isAutoTranslated: sourceHashes[key] != null,
			historyCount: historyCounts[key] ?? 0,
			isLongText: longTextFields.has(key) || defaultValue.length > 80,
			friendlyLabel: fieldLabels[key] ?? null,
			isStat: statFields.has(key),
			isStatTitle: statTitleFields.has(key),
			isExpertiseText: expertiseTextFields.has(key),
			isAboutText: aboutTextFields.has(key)
		});
	}

	// Count pending translations for the active page only
	let pendingTranslations = 0;
	if (locale !== 'ro') {
		const roDefaults = getDefaultTranslations('ro');
		const roRows = await db.select().from(siteText).where(eq(siteText.locale, 'ro'));
		const roOverrides: Record<string, string> = {};
		for (const row of roRows) roOverrides[row.key] = row.value;

		for (const [key] of Object.entries(defaults)) {
			const section = key.split('.')[0];
			if (!activeSections.has(section)) continue;
			if (roOverrides[key] === undefined) continue;

			const roValue = roOverrides[key];
			const currentHash = hashText(roValue);
			const existing = overrides[key];
			const existingSourceHash = sourceHashes[key];

			if (!existing) {
				pendingTranslations++;
			} else if (existingSourceHash !== null && existingSourceHash !== currentHash) {
				pendingTranslations++;
			}
		}
	}

	// Load siteConfig for structured data
	const configRows = await db.select().from(siteConfig);
	const config: Record<string, unknown> = {};
	for (const row of configRows) config[row.key] = row.value;

	return {
		sections,
		sectionLabels,
		locale,
		locales,
		pendingTranslations,
		pages: pageDefinitions.map((p) => ({ id: p.id, label: p.label })),
		activePage: pageDef.id,
		expertiseOrder: (config['expertise.order'] as string[] | undefined) ?? ['civil', 'commercial', 'family', 'realestate', 'labor'],
		contactEntries: (config['contact.entries'] as Array<{ type: string; label: string; value: string; linkPrefix?: string }> | undefined) ?? [
			{ type: 'address', label: 'Adresă Cabinet', value: 'Strada Trandafirilor nr. 3, Etaj 3\nPiata Centrala Giurgiu, Romania' },
			{ type: 'phone', label: 'Telefon', value: '+40 723 370 737', linkPrefix: 'tel:' },
			{ type: 'email', label: 'Email', value: 'office@cornaciu.ro\nsecretariat@cornaciu.ro', linkPrefix: 'mailto:' }
		]
	};
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
			if (aboutTextFields.has(key)) {
				// About text: save even empty strings (combined textarea may produce blanks)
				if (trimmed === defaults[key]) deletes.push(key);
				else updates.push({ key, value: trimmed });
			} else if (trimmed === '' || trimmed === defaults[key]) {
				deletes.push(key);
			} else {
				updates.push({ key, value: trimmed });
			}
		}

		for (const key of deletes) {
			await archiveField(key, locale, 'delete');
			await db.delete(siteText).where(and(eq(siteText.key, key), eq(siteText.locale, locale)));
		}

		for (const { key, value } of updates) {
			const [existing] = await db
				.select()
				.from(siteText)
				.where(and(eq(siteText.key, key), eq(siteText.locale, locale)))
				.limit(1);

			if (existing) {
				if (existing.value !== value) {
					await archiveField(key, locale, 'edit');
				}
				await db
					.update(siteText)
					.set({ value, sourceHash: null, updatedAt: new Date() })
					.where(eq(siteText.id, existing.id));
			} else {
				await db.insert(siteText).values({ key, locale, value });
			}
		}

		// Save structured config (expertise order, contact entries)
		const expertiseOrderJson = formData.get('expertiseOrder')?.toString();
		if (expertiseOrderJson) {
			try {
				const order: string[] = JSON.parse(expertiseOrderJson);
				const [existingConfig] = await db.select().from(siteConfig).where(eq(siteConfig.key, 'expertise.order')).limit(1);
				if (existingConfig) {
					await db.update(siteConfig).set({ value: order, updatedAt: new Date() }).where(eq(siteConfig.id, existingConfig.id));
				} else {
					await db.insert(siteConfig).values({ key: 'expertise.order', value: order });
				}
			} catch { /* invalid JSON */ }
		}
		const contactEntriesJson = formData.get('contactEntries')?.toString();
		if (contactEntriesJson) {
			try {
				const entries: Array<{ type: string; label: string; value: string; linkPrefix?: string }> = JSON.parse(contactEntriesJson);
				const [existingConfig] = await db.select().from(siteConfig).where(eq(siteConfig.key, 'contact.entries')).limit(1);
				if (existingConfig) {
					await db.update(siteConfig).set({ value: entries, updatedAt: new Date() }).where(eq(siteConfig.id, existingConfig.id));
				} else {
					await db.insert(siteConfig).values({ key: 'contact.entries', value: entries });
				}
			} catch { /* invalid JSON */ }
		}

		await audit({
			action: 'content.save',
			entity: 'content',
			details: { locale, updatedKeys: updates.map((u) => u.key), resetKeys: deletes },
			user: locals.user
		});

		return { success: true };
	},

	reset: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const formData = await request.formData();
		const key = formData.get('key')?.toString();
		const locale = formData.get('locale')?.toString() || 'ro';
		if (!key) return fail(400, { message: 'Cheie invalidă' });

		await archiveField(key, locale, 'delete');
		await db.delete(siteText).where(and(eq(siteText.key, key), eq(siteText.locale, locale)));
		await audit({ action: 'content.reset', entity: 'content', details: { key, locale }, user: locals.user });
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

		const roDefaults = getDefaultTranslations('ro');
		const roRows = await db.select().from(siteText).where(eq(siteText.locale, 'ro'));
		const roOverrides: Record<string, string> = {};
		for (const row of roRows) roOverrides[row.key] = row.value;

		const targetRows = await db.select().from(siteText).where(eq(siteText.locale, targetLocale));
		const targetOverrides: Record<string, string> = {};
		const targetSourceHashes: Record<string, string | null> = {};
		for (const row of targetRows) {
			targetOverrides[row.key] = row.value;
			targetSourceHashes[row.key] = row.sourceHash;
		}

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
				messages: [{ role: 'user', content: JSON.stringify(toTranslate) }]
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
				await archiveField(key, targetLocale, 'translate');
				await db
					.update(siteText)
					.set({ value, sourceHash: hash, updatedAt: new Date() })
					.where(eq(siteText.id, existing.id));
			} else {
				await db.insert(siteText).values({ key, locale: targetLocale, value, sourceHash: hash });
			}
			count++;
		}

		await audit({
			action: 'content.translate',
			entity: 'content',
			details: { targetLocale, fieldsTranslated: count },
			user: locals.user
		});

		return { translated: count };
	},

	history: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const formData = await request.formData();
		const key = formData.get('key')?.toString();
		const locale = formData.get('locale')?.toString() || 'ro';
		if (!key) return fail(400, { message: 'Cheie invalidă' });

		const rows = await db
			.select()
			.from(siteTextHistory)
			.where(and(eq(siteTextHistory.key, key), eq(siteTextHistory.locale, locale)))
			.orderBy(desc(siteTextHistory.changedAt))
			.limit(20);

		return {
			historyKey: key,
			historyEntries: rows.map((r) => ({
				id: r.id,
				value: r.value,
				changeType: r.changeType,
				changedAt: r.changedAt?.toISOString() ?? null
			}))
		};
	},

	restore: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const formData = await request.formData();
		const historyId = Number(formData.get('historyId'));
		const locale = formData.get('locale')?.toString() || 'ro';
		if (!historyId) return fail(400, { message: 'ID invalid' });

		const [entry] = await db
			.select()
			.from(siteTextHistory)
			.where(eq(siteTextHistory.id, historyId))
			.limit(1);
		if (!entry) return fail(404, { message: 'Versiune negăsită' });

		await archiveField(entry.key, locale, 'restore');

		const [existing] = await db
			.select()
			.from(siteText)
			.where(and(eq(siteText.key, entry.key), eq(siteText.locale, locale)))
			.limit(1);

		if (existing) {
			await db
				.update(siteText)
				.set({ value: entry.value, sourceHash: entry.sourceHash, updatedAt: new Date() })
				.where(eq(siteText.id, existing.id));
		} else {
			await db.insert(siteText).values({
				key: entry.key,
				locale,
				value: entry.value,
				sourceHash: entry.sourceHash
			});
		}

		await audit({
			action: 'content.restore',
			entity: 'content',
			details: { key: entry.key, locale, historyId },
			user: locals.user
		});

		return { restored: true, restoredKey: entry.key };
	},

	saveExpertiseOrder: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const formData = await request.formData();
		const orderJson = formData.get('order')?.toString();
		if (!orderJson) return fail(400, { message: 'Ordine invalidă' });

		let order: string[];
		try {
			order = JSON.parse(orderJson);
		} catch {
			return fail(400, { message: 'JSON invalid' });
		}

		const [existing] = await db
			.select()
			.from(siteConfig)
			.where(eq(siteConfig.key, 'expertise.order'))
			.limit(1);

		if (existing) {
			await db
				.update(siteConfig)
				.set({ value: order, updatedAt: new Date() })
				.where(eq(siteConfig.id, existing.id));
		} else {
			await db.insert(siteConfig).values({ key: 'expertise.order', value: order });
		}

		await audit({
			action: 'content.save',
			entity: 'config',
			details: { key: 'expertise.order', value: order },
			user: locals.user
		});

		return { success: true };
	},

	saveContactEntries: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');

		const formData = await request.formData();
		const entriesJson = formData.get('entries')?.toString();
		if (!entriesJson) return fail(400, { message: 'Date invalide' });

		let entries: Array<{ type: string; label: string; value: string; linkPrefix?: string }>;
		try {
			entries = JSON.parse(entriesJson);
		} catch {
			return fail(400, { message: 'JSON invalid' });
		}

		const [existing] = await db
			.select()
			.from(siteConfig)
			.where(eq(siteConfig.key, 'contact.entries'))
			.limit(1);

		if (existing) {
			await db
				.update(siteConfig)
				.set({ value: entries, updatedAt: new Date() })
				.where(eq(siteConfig.id, existing.id));
		} else {
			await db.insert(siteConfig).values({ key: 'contact.entries', value: entries });
		}

		await audit({
			action: 'content.save',
			entity: 'config',
			details: { key: 'contact.entries', count: entries.length },
			user: locals.user
		});

		return { success: true };
	}
};
