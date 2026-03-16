import ro from './ro.json';
import en from './en.json';
import bg from './bg.json';

export const locales = ['ro', 'en', 'bg'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
	ro: 'Română',
	en: 'English',
	bg: 'Български'
};

export const localeFlags: Record<Locale, string> = {
	ro: '/flags/ro.svg',
	en: '/flags/en.svg',
	bg: '/flags/bg.svg'
};

export const dateLocales: Record<Locale, string> = {
	ro: 'ro-RO',
	en: 'en-GB',
	bg: 'bg-BG'
};

const translations = { ro, en, bg };

export function isLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
}

/** Get a nested translation value by dot-separated key */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
	const parts = path.split('.');
	let current: unknown = obj;
	for (const part of parts) {
		if (current == null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === 'string' ? current : undefined;
}

/** Create a translate function for a given locale */
export function createT(locale: Locale) {
	const dict = translations[locale];
	return function t(key: string, params?: Record<string, string | number>): string {
		let value = getNestedValue(dict as unknown as Record<string, unknown>, key) ?? key;
		if (params) {
			for (const [k, v] of Object.entries(params)) {
				value = value.replaceAll(`{${k}}`, String(v));
			}
		}
		return value;
	};
}

/** Build a localized path. Romanian is default (no prefix). */
export function localePath(path: string, locale: Locale): string {
	const clean = path.startsWith('/') ? path : `/${path}`;
	if (locale === 'ro') return clean;
	return `/${locale}${clean}`;
}

/** Extract locale and remaining path from a URL pathname */
export function parseLocalePath(pathname: string): { locale: Locale; path: string } {
	const match = pathname.match(/^\/(en|bg)(\/|$)/);
	if (match) {
		const locale = match[1] as Locale;
		const rest = pathname.slice(match[0].length - (match[2] === '/' ? 1 : 0));
		return { locale, path: rest || '/' };
	}
	return { locale: 'ro', path: pathname };
}
