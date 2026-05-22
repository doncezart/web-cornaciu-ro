import { db } from '$lib/server/db';
import { article, testimonial, siteConfig } from '$lib/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { isLocale } from '$lib/i18n';

export const load: PageServerLoad = async ({ params }) => {
	const lang = isLocale(params.lang) ? params.lang : 'ro';

	const [articles, testimonials, configRows] = await Promise.all([
		db
			.select()
			.from(article)
			.where(and(eq(article.published, true), eq(article.featured, true), eq(article.lang, lang), eq(article.contentType, 'article')))
			.orderBy(desc(article.publishedAt))
			.limit(3),
		db
			.select()
			.from(testimonial)
			.where(eq(testimonial.published, true))
			.orderBy(desc(testimonial.createdAt))
			.limit(3),
		db.select().from(siteConfig)
	]);

	const config: Record<string, unknown> = {};
	for (const row of configRows) config[row.key] = row.value;

	return {
		articles,
		testimonials,
		expertiseOrder: (config['expertise.order'] as string[] | undefined) ?? null,
		contactEntries: (config['contact.entries'] as Array<{ type: string; label: string; value: string; linkPrefix?: string }> | undefined) ?? null
	};
};
