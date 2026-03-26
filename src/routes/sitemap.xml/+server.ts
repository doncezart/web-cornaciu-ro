import { db } from '$lib/server/db';
import { article } from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { locales, localePath, type Locale } from '$lib/i18n';
import type { RequestHandler } from './$types';

function escapeXml(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const GET: RequestHandler = async () => {
	const publishedArticles = await db
		.select({ slug: article.slug, lang: article.lang, updatedAt: article.updatedAt, contentType: article.contentType })
		.from(article)
		.where(eq(article.published, true))
		.orderBy(desc(article.publishedAt));

	const staticPages = [
		{ path: '/', priority: '1.0' },
		{ path: '/articole', priority: '0.8' },
		{ path: '/studii-de-caz', priority: '0.8' },
		{ path: '/confidentialitate', priority: '0.3' },
		{ path: '/termeni', priority: '0.3' },
		{ path: '/gdpr', priority: '0.3' }
	];

	const urls: string[] = [];

	// Static pages in all locales
	for (const page of staticPages) {
		for (const locale of locales) {
			const loc = escapeXml(`https://cornaciu.ro${localePath(page.path, locale)}`);
			urls.push(`  <url>
    <loc>${loc}</loc>
    <priority>${page.priority}</priority>
  </url>`);
		}
	}

	// Articles and case studies in their respective locale
	for (const a of publishedArticles) {
		const basePath = a.contentType === 'case-study' ? '/studii-de-caz' : '/articole';
		const loc = escapeXml(`https://cornaciu.ro${localePath(`${basePath}/${a.slug}`, a.lang as Locale)}`);
		const lastmod = a.updatedAt ? new Date(a.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
		urls.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.7</priority>
  </url>`);
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
