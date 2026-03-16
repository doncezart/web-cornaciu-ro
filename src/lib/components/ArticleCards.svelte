<script lang="ts">
	interface Article {
		id: number;
		slug: string;
		title: string;
		excerpt: string | null;
		category: string;
		publishedAt: Date | null;
		readingTime: number | null;
		imageUrl: string | null;
	}

	interface Props {
		articles: Article[];
		locale: import('$lib/i18n').Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	import { reveal } from '$lib/actions/reveal';
	import { localePath, dateLocales } from '$lib/i18n';

	let { articles, locale, t }: Props = $props();

	function formatDate(date: Date | null): string {
		if (!date) return '';
		return new Intl.DateTimeFormat(dateLocales[locale], {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(date));
	}
</script>

<section id="articole" class="articles">
	<div class="container-narrow">
		<div class="section-header animate-in" use:reveal>
			<span class="section-label">{t('articleCards.label')}</span>
			<h2 class="section-title">{t('articleCards.title')}</h2>
			<p class="section-description">{t('articleCards.description')}</p>
		</div>
		<div class="articles-grid" use:reveal>
			{#each articles as article}
				<a href={localePath(`/articole/${article.slug}`, locale)} class="article-card animate-in">
					<div class="article-image">
						{#if article.imageUrl}
							<img src={article.imageUrl} alt={article.title} loading="lazy" />
						{:else}
							<span>{t('articleCards.imageAlt')}</span>
						{/if}
					</div>
					<div class="article-content">
						<div class="article-meta">
							<span class="article-date">{formatDate(article.publishedAt)}</span>
							<span class="article-category">{article.category}</span>
						</div>
						<h3>{article.title}</h3>
						{#if article.excerpt}
							<p>{article.excerpt}</p>
						{/if}
						<span class="article-link">{t('articleCards.readMore')}</span>
					</div>
				</a>
			{/each}
		</div>
		<div class="all-articles-cta" use:reveal>
			<a href={localePath('/articole', locale)} class="btn-all-articles animate-in">{t('articleCards.viewAll')}</a>
		</div>
	</div>
</section>

<style>
	.articles {
		padding: 140px 0;
		background: var(--white);
	}

	.articles-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 48px;
		margin-top: 80px;
	}

	.article-card {
		background: var(--white);
		border: 1px solid var(--border);
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		text-decoration: none;
		display: block;
	}

	.article-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08);
	}

	.article-image {
		width: 100%;
		height: 280px;
		background: linear-gradient(135deg, var(--light) 0%, var(--border) 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--gray);
		font-size: 14px;
		letter-spacing: 1px;
		overflow: hidden;
	}

	.article-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.article-content {
		padding: 40px;
	}

	.article-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--border);
	}

	.article-date {
		color: var(--secondary);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.5px;
	}

	.article-category {
		font-size: 12px;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: var(--gray);
	}

	.article-card h3 {
		font-family: var(--font-serif);
		font-size: 26px;
		margin-bottom: 16px;
		color: var(--primary);
		font-weight: 500;
		line-height: 1.4;
	}

	.article-card p {
		color: var(--gray);
		line-height: 1.8;
		margin-bottom: 24px;
		font-size: 15px;
		font-weight: 300;
	}

	.article-link {
		color: var(--primary);
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		letter-spacing: 0.5px;
		transition: gap 0.3s ease;
	}

	.article-card:hover .article-link {
		gap: 12px;
	}

	@media (max-width: 968px) {
		.articles { padding: 80px 0; }
		.articles-grid { grid-template-columns: 1fr; }
	}

	.all-articles-cta {
		text-align: center;
		margin-top: 64px;
	}

	.btn-all-articles {
		display: inline-block;
		padding: 16px 40px;
		border: 2px solid var(--primary);
		color: var(--primary);
		text-decoration: none;
		font-size: 15px;
		font-weight: 500;
		letter-spacing: 0.5px;
		transition: all 0.3s ease;
	}

	.btn-all-articles:hover {
		background: var(--primary);
		color: var(--white);
	}
</style>
