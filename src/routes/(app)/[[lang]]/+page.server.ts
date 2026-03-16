import { db } from '$lib/server/db';
import { article, testimonial } from '$lib/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { isLocale } from '$lib/i18n';

export const load: PageServerLoad = async ({ params }) => {
	const lang = isLocale(params.lang) ? params.lang : 'ro';

	const [articles, testimonials] = await Promise.all([
		db
			.select()
			.from(article)
			.where(and(eq(article.published, true), eq(article.featured, true), eq(article.lang, lang)))
			.orderBy(desc(article.publishedAt))
			.limit(3),
		db
			.select()
			.from(testimonial)
			.where(eq(testimonial.published, true))
			.orderBy(desc(testimonial.createdAt))
			.limit(3)
	]);

	return { articles, testimonials };
};
