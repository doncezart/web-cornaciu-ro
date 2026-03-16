import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { article, testimonial, category } from '$lib/server/db/schema';
import { sql, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const [articleCount] = await db.select({ count: sql<number>`count(*)` }).from(article);
	const [testimonialCount] = await db.select({ count: sql<number>`count(*)` }).from(testimonial);
	const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(category);

	// Get article count per category
	const categoryCounts = await db
		.select({
			category: article.category,
			count: sql<number>`count(*)`
		})
		.from(article)
		.groupBy(article.category);

	return {
		articleCount: Number(articleCount.count),
		testimonialCount: Number(testimonialCount.count),
		categoryCount: Number(categoryCount.count),
		categoryCounts: categoryCounts.map((c) => ({ name: c.category, count: Number(c.count) }))
	};
};

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		redirect(302, '/login');
	}
};
