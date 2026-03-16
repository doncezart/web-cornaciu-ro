<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { createT, localePath, dateLocales, localeNames, type Locale } from '$lib/i18n';

	let { data } = $props();

	const locale = $derived(data.locale);
	const t = $derived(createT(locale));
	const a = $derived(data.article);

	function formatDate(date: Date | null): string {
		if (!date) return '';
		return new Intl.DateTimeFormat(dateLocales[locale], {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(date));
	}
</script>

<Seo
	{locale}
	title="{a.title} | Cabinet Avocat Cornaciu"
	description={a.excerpt ?? a.title}
	url="https://cornaciu.ro{localePath(`/articole/${a.slug}`, locale)}"
	type="article"
	image={a.imageUrl ?? '/og-image.jpg'}
	article={{
		publishedTime: a.publishedAt?.toISOString(),
		author: 'Avocat Cornaciu Cătălin',
		section: a.category,
		tags: [a.category]
	}}
/>

<article>
	<header class="article-header">
		<div class="container-narrow">
			<div class="breadcrumb">
				<a href={localePath('/', locale)}>{t('articles.breadcrumbHome')}</a>
				<span>/</span>
				<a href={localePath('/articole', locale)}>{t('articles.breadcrumbArticles')}</a>
				<span>/</span>
				<span>{t('articleDetail.breadcrumbArticle')}</span>
			</div>

			<div class="article-meta-top">
				<span class="article-category">{a.category}</span>
				<span class="article-date">{formatDate(a.publishedAt)}</span>
				{#if a.readingTime}
					<span class="article-reading-time">{t('articles.minRead', { min: a.readingTime })}</span>
				{/if}
			</div>

			<h1 class="article-title">{a.title}</h1>

			{#if a.excerpt}
				<p class="article-excerpt">{a.excerpt}</p>
			{/if}

			<div class="article-author">
				<div class="author-avatar">CC</div>
				<div class="author-info">
					<span class="author-name">Avocat Cornaciu Cătălin</span>
					<span class="author-title">{t('articleDetail.authorRole')}</span>
				</div>
			</div>
		</div>
	</header>

	<div class="article-body">
		<div class="container-narrow">
			{#if a.imageUrl}
				<div class="article-featured-image">
					<img src={a.imageUrl} alt={a.title} />
				</div>
			{/if}

			<div class="article-content">
				{@html a.content}
			</div>

			<div class="article-footer">
				<div class="article-tags">
					<span class="tag-label">{t('articleDetail.tags')}</span>
					<a href={localePath('/articole', locale)} class="tag">{a.category}</a>
				</div>
				{#if data.translations.length > 0}
					<div class="article-translations">
						<span class="tag-label">{t('articleDetail.availableIn')}</span>
						{#each data.translations as tr}
							<a href={localePath(`/articole/${tr.slug}`, tr.lang as Locale)} class="tag">{localeNames[tr.lang as Locale]}</a>
						{/each}
					</div>
				{/if}
			</div>

			<div class="author-bio">
				<div class="author-bio-content">
					<div class="author-bio-avatar">CC</div>
					<div class="author-bio-text">
						<h4>Avocat Cornaciu Cătălin</h4>
						<p class="author-bio-role">{t('articleDetail.authorRole')}</p>
						<p>{t('articleDetail.authorBio')}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</article>

{#if data.related.length > 0}
	<section class="related-articles">
		<div class="container">
			<div class="section-header">
				<span class="section-label">{t('articleDetail.relatedLabel')}</span>
				<h2 class="section-title">{t('articleDetail.relatedTitle')}</h2>
			</div>
			<div class="related-grid">
				{#each data.related as rel}
					<a href={localePath(`/articole/${rel.slug}`, locale)} class="related-card">
						<div class="related-image">
							{#if rel.imageUrl}
								<img src={rel.imageUrl} alt={rel.title} />
							{:else}
								<span>{t('articleCards.imageAlt')}</span>
							{/if}
						</div>
						<div class="related-content">
							<div class="related-meta">
								<span class="related-date">{formatDate(rel.publishedAt)}</span>
								<span class="related-category">{rel.category}</span>
							</div>
							<h3>{rel.title}</h3>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<section class="article-cta">
	<div class="container-narrow">
		<h2>{t('articleDetail.ctaTitle')}</h2>
		<p>{t('articleDetail.ctaDescription')}</p>
		<a href="{localePath('/', locale)}#contact" class="cta-button">{t('articleDetail.ctaButton')}</a>
	</div>
</section>

<style>
	/* Article Header */
	.article-header {
		padding: 160px 0 80px;
		background: var(--light);
		border-bottom: 1px solid var(--border);
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 32px;
		font-size: 14px;
		color: var(--gray);
	}

	.breadcrumb a {
		color: var(--gray);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.breadcrumb a:hover {
		color: var(--secondary);
	}

	.breadcrumb span {
		color: var(--border);
	}

	.article-meta-top {
		display: flex;
		align-items: center;
		gap: 24px;
		margin-bottom: 32px;
	}

	.article-category {
		font-size: 13px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--secondary);
		font-weight: 600;
	}

	.article-date, .article-reading-time {
		font-size: 14px;
		color: var(--gray);
		font-weight: 400;
	}

	.article-title {
		font-family: var(--font-serif);
		font-size: 64px;
		line-height: 1.15;
		margin-bottom: 32px;
		color: var(--primary);
		font-weight: 400;
		letter-spacing: -1px;
	}

	.article-excerpt {
		font-size: 22px;
		line-height: 1.6;
		color: var(--gray);
		margin-bottom: 48px;
		font-weight: 300;
	}

	.article-author {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 32px 0;
		border-top: 1px solid var(--border);
	}

	.author-avatar {
		width: 60px;
		height: 60px;
		background: var(--secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 24px;
		font-weight: 600;
	}

	.author-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.author-name {
		font-weight: 600;
		color: var(--primary);
		font-size: 16px;
	}

	.author-title {
		font-size: 14px;
		color: var(--gray);
		font-weight: 300;
	}

	/* Article Body */
	.article-body {
		padding: 100px 0;
	}

	.article-featured-image {
		width: 100%;
		height: 500px;
		margin-bottom: 80px;
		border: 1px solid var(--border);
		overflow: hidden;
	}

	.article-featured-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.article-content {
		font-size: 18px;
		line-height: 1.9;
		color: var(--primary);
	}

	.article-content :global(h2) {
		font-family: var(--font-serif);
		font-size: 40px;
		margin: 64px 0 24px;
		color: var(--primary);
		font-weight: 500;
		line-height: 1.3;
	}

	.article-content :global(h2:first-child) {
		margin-top: 0;
	}

	.article-content :global(h3) {
		font-family: var(--font-serif);
		font-size: 32px;
		margin: 48px 0 20px;
		color: var(--primary);
		font-weight: 500;
		line-height: 1.4;
	}

	.article-content :global(p) {
		margin-bottom: 28px;
		font-weight: 300;
	}

	.article-content :global(strong) {
		font-weight: 600;
		color: var(--primary);
	}

	.article-content :global(ul),
	.article-content :global(ol) {
		margin: 32px 0 32px 32px;
	}

	.article-content :global(li) {
		margin-bottom: 16px;
		font-weight: 300;
	}

	.article-content :global(blockquote) {
		margin: 48px 0;
		padding: 40px 48px;
		background: var(--light);
		border-left: 3px solid var(--secondary);
		font-size: 20px;
		line-height: 1.8;
		font-weight: 300;
		font-style: italic;
	}

	.article-content :global(blockquote p) {
		margin-bottom: 0;
	}

	.article-content :global(a) {
		color: var(--secondary);
		text-decoration: none;
		border-bottom: 1px solid var(--secondary);
		transition: all 0.3s ease;
	}

	.article-content :global(a:hover) {
		color: var(--primary);
		border-bottom-color: var(--primary);
	}

	/* Article Footer */
	.article-footer {
		border-top: 1px solid var(--border);
		padding-top: 48px;
		margin-top: 80px;
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}

	.article-translations {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
		margin-top: 24px;
	}

	.tag-label {
		font-size: 13px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: var(--gray);
		font-weight: 600;
		margin-right: 12px;
	}

	.tag {
		padding: 8px 20px;
		border: 1px solid var(--border);
		font-size: 14px;
		color: var(--primary);
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.tag:hover {
		border-color: var(--secondary);
		color: var(--secondary);
	}

	/* Author Bio */
	.author-bio {
		background: var(--light);
		padding: 56px;
		margin: 80px 0;
		border: 1px solid var(--border);
	}

	.author-bio-content {
		display: flex;
		gap: 32px;
		align-items: flex-start;
	}

	.author-bio-avatar {
		width: 100px;
		height: 100px;
		background: var(--secondary);
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 40px;
		font-weight: 600;
	}

	.author-bio-text h4 {
		font-family: var(--font-serif);
		font-size: 28px;
		margin-bottom: 8px;
		color: var(--primary);
	}

	.author-bio-text .author-bio-role {
		font-size: 14px;
		color: var(--secondary);
		letter-spacing: 1px;
		text-transform: uppercase;
		margin-bottom: 20px;
		font-weight: 600;
	}

	.author-bio-text p {
		font-size: 16px;
		line-height: 1.8;
		color: var(--gray);
		font-weight: 300;
	}

	/* Related Articles */
	.related-articles {
		padding: 100px 0;
		background: var(--white);
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 40px;
	}

	.related-card {
		border: 1px solid var(--border);
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		text-decoration: none;
		display: block;
	}

	.related-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08);
	}

	.related-image {
		width: 100%;
		height: 240px;
		background: linear-gradient(135deg, var(--light) 0%, var(--border) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gray);
		font-size: 14px;
		overflow: hidden;
	}

	.related-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.related-content {
		padding: 32px;
	}

	.related-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border);
	}

	.related-date {
		font-size: 13px;
		color: var(--secondary);
		font-weight: 500;
	}

	.related-category {
		font-size: 12px;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: var(--gray);
	}

	.related-card h3 {
		font-family: var(--font-serif);
		font-size: 24px;
		color: var(--primary);
		font-weight: 500;
		line-height: 1.4;
	}

	/* CTA */
	.article-cta {
		background: var(--primary);
		padding: 100px 0;
		text-align: center;
	}

	.article-cta h2 {
		font-family: var(--font-serif);
		font-size: 48px;
		color: var(--white);
		margin-bottom: 24px;
		font-weight: 400;
	}

	.article-cta p {
		font-size: 18px;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 40px;
		font-weight: 300;
	}

	.cta-button {
		background: var(--white);
		color: var(--primary);
		padding: 18px 48px;
		border: 2px solid var(--white);
		cursor: pointer;
		font-weight: 500;
		font-size: 16px;
		letter-spacing: 0.3px;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		text-decoration: none;
		display: inline-block;
	}

	.cta-button:hover {
		background: transparent;
		color: var(--white);
	}

	@media (max-width: 1200px) {
		.article-title { font-size: 52px; }
	}

	@media (max-width: 968px) {
		.article-title { font-size: 40px; }

		.article-featured-image { height: 300px; }

		.article-content :global(h2) { font-size: 32px; }
		.article-content :global(h3) { font-size: 26px; }

		.related-grid { grid-template-columns: 1fr; }

		.author-bio { padding: 32px; }
		.author-bio-content { flex-direction: column; }

		.article-cta h2 { font-size: 32px; }
	}
</style>
