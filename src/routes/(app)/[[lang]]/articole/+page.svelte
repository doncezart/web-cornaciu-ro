<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { createT, localePath, dateLocales } from '$lib/i18n';

	let { data } = $props();

	const locale = $derived(data.locale);
	const t = $derived(createT(locale));

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
	title={t('articles.pageTitle')}
	description={t('articles.pageDescription')}
	url="https://cornaciu.ro{localePath('/articole', locale)}"
/>

<section class="page-header">
	<div class="container-narrow">
		<div class="breadcrumb">
			<a href={localePath('/', locale)}>{t('articles.breadcrumbHome')}</a>
			<span>/</span>
			<span>{t('articles.breadcrumbArticles')}</span>
		</div>
		<span class="section-label">{t('articleCards.label')}</span>
		<h1>{t('articles.heading')}</h1>
		<p class="page-description">{t('articles.description')}</p>
	</div>
</section>

<section class="articles-listing">
	<div class="container-narrow">
		{#if data.categories.length > 1}
			<div class="category-filter">
				<a href={localePath('/articole', locale)} class="filter-btn" class:active={!data.categoryFilter}>{t('articles.all')}</a>
				{#each data.categories as cat}
					<a href="{localePath('/articole', locale)}?categorie={encodeURIComponent(cat)}" class="filter-btn" class:active={data.categoryFilter === cat}>{cat}</a>
				{/each}
			</div>
		{/if}

		{#if data.articles.length === 0}
			<p class="no-articles">{t('articles.noArticles')}</p>
		{:else}
			<div class="articles-grid">
				{#each data.articles as article}
					<a href={localePath(`/articole/${article.slug}`, locale)} class="article-card">
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
							<h2>{article.title}</h2>
							{#if article.excerpt}
								<p>{article.excerpt}</p>
							{/if}
							<span class="article-link">{t('articles.readArticle')}</span>
						</div>
					</a>
				{/each}
			</div>

			{#if data.totalPages > 1}
				<nav class="pagination">
					{#if data.page > 1}
						<a href="{localePath('/articole', locale)}?pagina={data.page - 1}{data.categoryFilter ? `&categorie=${encodeURIComponent(data.categoryFilter)}` : ''}" class="page-link">{t('articles.prevPage')}</a>
					{/if}
					<span class="page-info">{t('articles.pageOf', { page: data.page, total: data.totalPages })}</span>
					{#if data.page < data.totalPages}
						<a href="{localePath('/articole', locale)}?pagina={data.page + 1}{data.categoryFilter ? `&categorie=${encodeURIComponent(data.categoryFilter)}` : ''}" class="page-link">{t('articles.nextPage')}</a>
					{/if}
				</nav>
			{/if}
		{/if}
	</div>
</section>

<style>
	.page-header {
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

	h1 {
		font-family: var(--font-serif);
		font-size: 56px;
		line-height: 1.2;
		color: var(--primary);
		font-weight: 400;
		margin-bottom: 24px;
	}

	.page-description {
		font-size: 20px;
		line-height: 1.7;
		color: var(--gray);
		font-weight: 300;
	}

	.articles-listing {
		padding: 100px 0;
	}

	.no-articles {
		text-align: center;
		color: var(--gray);
		font-size: 18px;
		padding: 80px 0;
	}

	.articles-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 48px;
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
	}

	.article-category {
		font-size: 12px;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: var(--gray);
	}

	.article-card h2 {
		font-family: var(--font-serif);
		font-size: 28px;
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
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.article-link {
		color: var(--primary);
		font-weight: 500;
		font-size: 14px;
		letter-spacing: 0.5px;
		transition: gap 0.3s ease;
		display: inline-flex;
		gap: 8px;
	}

	.article-card:hover .article-link {
		gap: 12px;
	}

	@media (max-width: 968px) {
		h1 { font-size: 40px; }
		.articles-grid { grid-template-columns: 1fr; }
	}

	.category-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 48px;
	}

	.filter-btn {
		padding: 8px 20px;
		font-size: 13px;
		letter-spacing: 0.5px;
		border: 1px solid var(--border);
		color: var(--gray);
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.filter-btn:hover,
	.filter-btn.active {
		background: var(--primary);
		color: var(--white);
		border-color: var(--primary);
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 24px;
		margin-top: 64px;
		padding-top: 48px;
		border-top: 1px solid var(--border);
	}

	.page-link {
		padding: 10px 24px;
		border: 1px solid var(--border);
		color: var(--primary);
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	.page-link:hover {
		background: var(--primary);
		color: var(--white);
		border-color: var(--primary);
	}

	.page-info {
		font-size: 14px;
		color: var(--gray);
	}
</style>
