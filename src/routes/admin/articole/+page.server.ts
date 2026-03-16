import { db } from '$lib/server/db';
import { article } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const articles = await db
		.select()
		.from(article)
		.orderBy(desc(article.createdAt));

	return { articles };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'ID invalid' });

		await db.delete(article).where(eq(article.id, id));
		return { success: true };
	},
	togglePublish: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const published = formData.get('published') === 'true';

		if (!id) return fail(400, { message: 'ID invalid' });

		// Preserve existing publishedAt if re-publishing
		const [existing] = await db.select().from(article).where(eq(article.id, id)).limit(1);
		const newPublished = !published;
		let publishedAt = existing?.publishedAt ?? null;
		if (newPublished && !publishedAt) {
			publishedAt = new Date();
		} else if (!newPublished) {
			publishedAt = null;
		}

		await db
			.update(article)
			.set({ published: newPublished, publishedAt })
			.where(eq(article.id, id));

		return { success: true };
	},
	toggleFeatured: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const featured = formData.get('featured') === 'true';

		if (!id) return fail(400, { message: 'ID invalid' });

		await db
			.update(article)
			.set({ featured: !featured })
			.where(eq(article.id, id));

		return { success: true };
	}
};
