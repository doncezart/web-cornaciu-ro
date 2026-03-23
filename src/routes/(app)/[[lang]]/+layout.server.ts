import { error } from '@sveltejs/kit';
import { isLocale, type Locale } from '$lib/i18n';
import { db } from '$lib/server/db';
import { siteText } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, cookies }) => {
	const langParam = params.lang;

	let locale: Locale = 'ro';
	if (langParam) {
		if (!isLocale(langParam)) {
			error(404, 'Not found');
		}
		locale = langParam;
	}

	cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365, httpOnly: false, secure: true, sameSite: 'lax' });

	const rows = await db.select().from(siteText).where(eq(siteText.locale, locale));
	const overrides: Record<string, string> = {};
	for (const row of rows) {
		overrides[row.key] = row.value;
	}

	return { locale, overrides };
};
