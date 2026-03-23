import { db } from '$lib/server/db';
import { legalPage } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { locale } = await parent();
	const [row] = await db
		.select()
		.from(legalPage)
		.where(and(eq(legalPage.slug, 'gdpr'), eq(legalPage.locale, locale)))
		.limit(1);

	const html = row ? DOMPurify.sanitize(await marked.parse(row.content)) : null;
	return { legalContent: html };
};
