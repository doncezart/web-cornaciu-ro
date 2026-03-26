import { db } from '$lib/server/db';
import { article } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import { audit } from '$lib/server/audit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const caseStudies = await db
		.select()
		.from(article)
		.where(eq(article.contentType, 'case-study'))
		.orderBy(desc(article.createdAt));

	return { caseStudies };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'ID invalid' });

		const [deleted] = await db.select({ title: article.title }).from(article).where(eq(article.id, id)).limit(1);
		await db.delete(article).where(eq(article.id, id));
		await audit({ action: 'caseStudy.delete', entity: 'article', entityId: id, details: { title: deleted?.title, contentType: 'case-study' }, user: locals.user });
		return { success: true };
	},
	togglePublish: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const published = formData.get('published') === 'true';

		if (!id) return fail(400, { message: 'ID invalid' });

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

		await audit({ action: 'caseStudy.togglePublish', entity: 'article', entityId: id, details: { published: newPublished, title: existing?.title, contentType: 'case-study' }, user: locals.user });
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

		await audit({ action: 'caseStudy.toggleFeatured', entity: 'article', entityId: id, details: { featured: !featured, contentType: 'case-study' }, user: locals.user });
		return { success: true };
	}
};
