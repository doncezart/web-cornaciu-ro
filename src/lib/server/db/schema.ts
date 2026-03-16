import { pgTable, serial, integer, text, boolean, timestamp, json } from 'drizzle-orm/pg-core';

export const article = pgTable('article', {
	id: serial('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	excerpt: text('excerpt'),
	content: text('content').notNull(),
	category: text('category').notNull(),
	imageUrl: text('image_url'),
	readingTime: integer('reading_time').default(5),
	published: boolean('published').default(false),
	featured: boolean('featured').default(false),
	publishedAt: timestamp('published_at', { mode: 'date' }),
	editHistory: json('edit_history').$type<string[]>().default([]),
	lang: text('lang').notNull().default('ro'),
	translationGroup: text('translation_group'),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow()
});

export const testimonial = pgTable('testimonial', {
	id: serial('id').primaryKey(),
	quote: text('quote'),
	authorName: text('author_name').notNull(),
	authorTitle: text('author_title'),
	rating: integer('rating').default(5),
	published: boolean('published').default(true),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow()
});

export const category = pgTable('category', {
	id: serial('id').primaryKey(),
	name: text('name').notNull().unique(),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow()
});

export * from './auth.schema';
