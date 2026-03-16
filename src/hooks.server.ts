import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { parseLocalePath } from '$lib/i18n';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

const handleLang: Handle = async ({ event, resolve }) => {
	const { locale } = parseLocalePath(event.url.pathname);
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('lang="ro"', `lang="${locale}"`)
	});
};

export const handle: Handle = sequence(handleLang, handleBetterAuth);
