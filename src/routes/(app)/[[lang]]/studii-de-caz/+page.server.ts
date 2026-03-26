import { db } from '$lib/server/db';
import { article } from '$lib/server/db/schema';
import { desc, eq, sql, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { isLocale } from '$lib/i18n';

const PER_PAGE = 6;

export const load: PageServerLoad = async ({ url, params }) => {
	const lang = isLocale(params.lang) ? params.lang : 'ro';
	const page = Math.max(1, Number(url.searchParams.get('pagina')) || 1);
	const categoryFilter = url.searchParams.get('categorie') || null;

	const baseConditions = [
		eq(article.published, true),
		eq(article.lang, lang),
		eq(article.contentType, 'case-study')
	];

	const where = categoryFilter
		? and(...baseConditions, eq(article.category, categoryFilter))
		: and(...baseConditions);

	const [{ count: totalCount }] = await db
		.select({ count: sql<number>`count(*)` })
		.from(article)
		.where(where);

	const total = Number(totalCount);
	const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

	const caseStudies = await db
		.select()
		.from(article)
		.where(where)
		.orderBy(desc(article.publishedAt))
		.limit(PER_PAGE)
		.offset((page - 1) * PER_PAGE);

	const categories = await db
		.selectDistinct({ category: article.category })
		.from(article)
		.where(and(eq(article.published, true), eq(article.lang, lang), eq(article.contentType, 'case-study')))
		.orderBy(article.category);

	return {
		caseStudies,
		page,
		totalPages,
		total,
		categoryFilter,
		categories: categories.map((c) => c.category)
	};
};
