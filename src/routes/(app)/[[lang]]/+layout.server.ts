import { error } from '@sveltejs/kit';
import { isLocale, type Locale } from '$lib/i18n';
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

	cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365, httpOnly: false, secure: false, sameSite: 'lax' });

	return { locale };
};
