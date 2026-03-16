import { fail, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { article, category } from '$lib/server/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { locales } from '$lib/i18n';
import { slugify } from '$lib/utils/slugify';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	if (!id) error(404, 'Articol negăsit');

	const [found] = await db.select().from(article).where(eq(article.id, id)).limit(1);
	if (!found) error(404, 'Articol negăsit');

	const categories = await db.select().from(category).orderBy(category.name);

	// Get full translations in the same group
	const translations = found.translationGroup
		? await db
				.select()
				.from(article)
				.where(and(eq(article.translationGroup, found.translationGroup), ne(article.id, found.id)))
		: [];

	return { article: found, categories, locales, translations };
};

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const id = Number(params.id);
		const formData = await request.formData();
		const title = formData.get('title')?.toString()?.trim();
		const markdown = formData.get('content')?.toString()?.trim();
		const categoryName = formData.get('category')?.toString()?.trim();
		const excerpt = formData.get('excerpt')?.toString()?.trim() || null;
		const imageUrl = formData.get('imageUrl')?.toString()?.trim() || null;
		const readingTime = Number(formData.get('readingTime')) || 5;
		const published = formData.get('published') === 'on';
		const featured = formData.get('featured') === 'on';
		const regenerateSlug = formData.get('regenerateSlug') === 'on';
		const lang = formData.get('lang')?.toString()?.trim() || 'ro';

		if (!title || !markdown || !categoryName) {
			return fail(400, { message: 'Titlul, conținutul și categoria sunt obligatorii' });
		}

		const [existing] = await db.select().from(article).where(eq(article.id, id)).limit(1);
		if (!existing) return fail(404, { message: 'Articol negăsit' });

		const slug = regenerateSlug ? slugify(title) : existing.slug;

		let publishedAt = existing.publishedAt;
		if (published && !existing.publishedAt) {
			publishedAt = new Date();
		} else if (!published) {
			publishedAt = null;
		}

		const editHistory = [...(existing.editHistory ?? []), new Date().toISOString()];

		await db
			.update(article)
			.set({
				slug, title, content: markdown, category: categoryName,
				excerpt, imageUrl, readingTime, published, featured, publishedAt,
				lang, editHistory, updatedAt: new Date()
			})
			.where(eq(article.id, id));

		// Sync category and image to all translations
		if (existing.translationGroup) {
			await db
				.update(article)
				.set({ category: categoryName, imageUrl })
				.where(and(eq(article.translationGroup, existing.translationGroup), ne(article.id, id)));
		}

		return { success: true };
	},

	saveTranslation: async ({ request, params, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const mainId = Number(params.id);
		const formData = await request.formData();
		const lang = formData.get('lang')?.toString()?.trim();
		const translationId = formData.get('translationId')?.toString()?.trim();
		const title = formData.get('title')?.toString()?.trim();
		const excerpt = formData.get('excerpt')?.toString()?.trim() || null;
		const content = formData.get('content')?.toString()?.trim();
		const readingTime = Number(formData.get('readingTime')) || 5;
		const published = formData.get('published') === 'on';

		if (!title || !content || !lang) {
			return fail(400, { message: 'Titlul și conținutul sunt obligatorii' });
		}

		const [main] = await db.select().from(article).where(eq(article.id, mainId)).limit(1);
		if (!main) return fail(404, { message: 'Articol negăsit' });

		// Ensure translationGroup exists on the main article
		let groupId = main.translationGroup;
		if (!groupId) {
			groupId = crypto.randomUUID();
			await db.update(article).set({ translationGroup: groupId }).where(eq(article.id, mainId));
		}

		if (translationId) {
			// Update existing translation
			const trId = Number(translationId);
			const [existing] = await db.select().from(article).where(eq(article.id, trId)).limit(1);
			if (!existing) return fail(404, { message: 'Traducere negăsită' });

			let publishedAt = existing.publishedAt;
			if (published && !existing.publishedAt) publishedAt = new Date();
			else if (!published) publishedAt = null;

			const editHistory = [...(existing.editHistory ?? []), new Date().toISOString()];

			await db.update(article).set({
				title, excerpt, content, readingTime,
				published, publishedAt, editHistory,
				updatedAt: new Date()
			}).where(eq(article.id, trId));
		} else {
			// Create new translation
			let slug = slugify(title);
			const existingSlug = await db.select({ id: article.id }).from(article).where(eq(article.slug, slug)).limit(1);
			if (existingSlug.length > 0) slug = `${slug}-${Date.now().toString(36)}`;

			await db.insert(article).values({
				slug, title, excerpt, content,
				category: main.category,
				imageUrl: main.imageUrl,
				readingTime,
				published,
				featured: false,
				lang,
				translationGroup: groupId,
				publishedAt: published ? new Date() : null
			});
		}

		return { translationSaved: lang };
	},

	deleteTranslation: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const translationId = Number(formData.get('translationId'));

		if (!translationId) return fail(400, { message: 'ID invalid' });

		await db.delete(article).where(eq(article.id, translationId));
		return { translationDeleted: true };
	},

	togglePublish: async ({ params, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const id = Number(params.id);
		const [existing] = await db.select().from(article).where(eq(article.id, id)).limit(1);
		if (!existing) return fail(404, { message: 'Articol negăsit' });

		const published = !existing.published;
		const publishedAt = published ? (existing.publishedAt ?? new Date()) : null;

		await db.update(article).set({ published, publishedAt, updatedAt: new Date() }).where(eq(article.id, id));
		return { success: true };
	},

	toggleTranslationPublish: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const translationId = Number(formData.get('translationId'));
		if (!translationId) return fail(400, { message: 'ID invalid' });

		const [existing] = await db.select().from(article).where(eq(article.id, translationId)).limit(1);
		if (!existing) return fail(404, { message: 'Traducere negăsită' });

		const published = !existing.published;
		const publishedAt = published ? (existing.publishedAt ?? new Date()) : null;

		await db.update(article).set({ published, publishedAt, updatedAt: new Date() }).where(eq(article.id, translationId));
		return { translationSaved: existing.lang };
	}
};
