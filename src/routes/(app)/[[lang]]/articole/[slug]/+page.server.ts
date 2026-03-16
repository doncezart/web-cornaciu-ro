import { db } from '$lib/server/db';
import { article } from '$lib/server/db/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import type { PageServerLoad } from './$types';
import { isLocale } from '$lib/i18n';

export const load: PageServerLoad = async ({ params }) => {
	const lang = isLocale(params.lang) ? params.lang : 'ro';

	const [found] = await db
		.select()
		.from(article)
		.where(and(eq(article.slug, params.slug), eq(article.published, true)))
		.limit(1);

	if (!found) {
		error(404, 'Articolul nu a fost găsit');
	}

	const related = await db
		.select()
		.from(article)
		.where(and(eq(article.published, true), eq(article.lang, lang), ne(article.id, found.id)))
		.orderBy(desc(article.publishedAt))
		.limit(3);

	// Get translations of this article (same translationGroup)
	const translations = found.translationGroup
		? await db
				.select({ lang: article.lang, slug: article.slug })
				.from(article)
				.where(
					and(
						eq(article.translationGroup, found.translationGroup),
						eq(article.published, true),
						ne(article.id, found.id)
					)
				)
		: [];

	const rawHtml = await marked.parse(found.content);
	const htmlContent = DOMPurify.sanitize(rawHtml);
	return { article: { ...found, content: htmlContent }, related, translations };
};
