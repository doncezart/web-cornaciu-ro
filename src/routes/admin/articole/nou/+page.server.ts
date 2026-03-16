import { fail, redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { article, category } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { locales } from '$lib/i18n';
import { slugify } from '$lib/utils/slugify';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const categories = await db.select().from(category).orderBy(category.name);
	return { categories, locales };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const title = formData.get('title')?.toString()?.trim();
		const markdown = formData.get('content')?.toString()?.trim();
		const categoryName = formData.get('category')?.toString()?.trim();
		const excerpt = formData.get('excerpt')?.toString()?.trim() || null;
		const imageUrl = formData.get('imageUrl')?.toString()?.trim() || null;
		const readingTime = Number(formData.get('readingTime')) || 5;
		const published = formData.get('published') === 'on';
		const featured = formData.get('featured') === 'on';
		const lang = formData.get('lang')?.toString()?.trim() || 'ro';

		if (!title || !markdown || !categoryName) {
			return fail(400, { message: 'Titlul, conținutul și categoria sunt obligatorii' });
		}

		let slug = slugify(title);

		// Handle slug collision by appending a suffix
		const existing = await db.select({ id: article.id }).from(article).where(eq(article.slug, slug)).limit(1);
		if (existing.length > 0) {
			slug = `${slug}-${Date.now().toString(36)}`;
		}

		const [created] = await db.insert(article).values({
			slug,
			title,
			content: markdown,
			category: categoryName,
			excerpt,
			imageUrl,
			readingTime,
			published,
			featured,
			lang,
			publishedAt: published ? new Date() : null
		}).returning();

		redirect(302, `/admin/articole/${created.id}`);
	}
};
