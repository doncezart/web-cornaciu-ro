import { db } from '$lib/server/db';
import { testimonial } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const testimonials = await db
		.select()
		.from(testimonial)
		.orderBy(desc(testimonial.createdAt));

	return { testimonials };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const quote = formData.get('quote')?.toString()?.trim() || null;
		const authorName = formData.get('authorName')?.toString()?.trim();
		const authorTitle = formData.get('authorTitle')?.toString()?.trim() || null;
		const rating = Number(formData.get('rating')) || 5;

		if (!authorName) {
			return fail(400, { message: 'Numele este obligatoriu' });
		}

		await db.insert(testimonial).values({
			quote,
			authorName,
			authorTitle,
			rating,
			published: true
		});

		return { success: true };
	},
	edit: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const quote = formData.get('quote')?.toString()?.trim() || null;
		const authorName = formData.get('authorName')?.toString()?.trim();
		const authorTitle = formData.get('authorTitle')?.toString()?.trim() || null;
		const rating = Number(formData.get('rating')) || 5;

		if (!id) return fail(400, { message: 'ID invalid' });
		if (!authorName) return fail(400, { message: 'Numele este obligatoriu' });

		await db.update(testimonial).set({ quote, authorName, authorTitle, rating }).where(eq(testimonial.id, id));
		return { success: true };
	},
	delete: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		if (!id) return fail(400, { message: 'ID invalid' });

		await db.delete(testimonial).where(eq(testimonial.id, id));
		return { success: true };
	},
	togglePublish: async ({ request, locals }) => {
		if (!locals.user) error(401, 'Neautorizat');
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const published = formData.get('published') === 'true';

		if (!id) return fail(400, { message: 'ID invalid' });

		await db.update(testimonial).set({ published: !published }).where(eq(testimonial.id, id));
		return { success: true };
	}
};
