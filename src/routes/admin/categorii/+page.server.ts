import { db } from '$lib/server/db';
import { category, article } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const categories = await db.select().from(category).orderBy(category.name);

	// Get article counts per category name
	const counts = await db
		.select({ category: article.category, count: sql<number>`count(*)` })
		.from(article)
		.groupBy(article.category);

	const countMap = new Map(counts.map((c) => [c.category, Number(c.count)]));
	const categoriesWithCounts = categories.map((cat) => ({
		...cat,
		articleCount: countMap.get(cat.name) ?? 0
	}));

	return { categories: categoriesWithCounts };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const name = formData.get('name')?.toString()?.trim();
		if (!name) return fail(400, { message: 'Numele categoriei este obligatoriu' });

		try {
			await db.insert(category).values({ name });
		} catch {
			return fail(400, { message: 'Această categorie există deja' });
		}
		return { success: true };
	},

	update: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const name = formData.get('name')?.toString()?.trim();
		if (!id || !name) return fail(400, { message: 'Date invalide' });

		try {
			await db.update(category).set({ name }).where(eq(category.id, id));
		} catch {
			return fail(400, { message: 'Această categorie există deja' });
		}
		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		if (!id) return fail(400, { message: 'ID invalid' });

		// Find category name to check for articles
		const [cat] = await db.select().from(category).where(eq(category.id, id)).limit(1);
		if (!cat) return fail(404, { message: 'Categoria nu a fost găsită' });

		const [{ count }] = await db
			.select({ count: sql<number>`count(*)` })
			.from(article)
			.where(eq(article.category, cat.name));

		if (Number(count) > 0) {
			return fail(400, { message: `Categoria are ${count} articole. Mută articolele în altă categorie înainte de ștergere.` });
		}

		await db.delete(category).where(eq(category.id, id));
		return { success: true };
	}
};
