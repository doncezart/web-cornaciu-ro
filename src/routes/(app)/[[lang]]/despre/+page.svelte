<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { createT, localePath } from '$lib/i18n';
	import { reveal } from '$lib/actions/reveal';

	let { data } = $props();

	const locale = $derived(data.locale);
	const t = $derived(createT(locale, data.overrides));
</script>

<Seo
	{locale}
	title={t('aboutPage.seoTitle')}
	description={t('aboutPage.seoDesc')}
	url="https://cornaciu.ro{localePath('/despre', locale)}"
/>

<section class="about-hero">
	<div class="container-narrow">
		<div class="breadcrumb">
			<a href={localePath('/', locale)}>{t('aboutPage.breadcrumbHome')}</a>
			<span>/</span>
			<span>{t('aboutPage.breadcrumbAbout')}</span>
		</div>
		<span class="section-label">{t('aboutPage.label')}</span>
		<h1>{t('aboutPage.title')}</h1>
		<p class="subtitle">{t('aboutPage.subtitle')}</p>
	</div>
</section>

<section class="about-body">
	<div class="container-narrow">
		<div class="about-layout" use:reveal>
			<div class="about-photo">
				<img src="/cornaciu2.png" alt="Avocat Cornaciu Cătălin" />
			</div>
			<div class="about-text">
				<p>{t('aboutPage.bio1')}</p>
				<p>{t('aboutPage.bio2')}</p>
				<p>{t('aboutPage.bio3')}</p>
			</div>
		</div>

		<div class="philosophy" use:reveal>
			<h2>{t('aboutPage.philosophyTitle')}</h2>
			<p>{t('aboutPage.philosophy1')}</p>
			<p>{t('aboutPage.philosophy2')}</p>
		</div>

		<div class="credentials-section" use:reveal>
			<h2>{t('aboutPage.credentialsTitle')}</h2>
			<ul class="credentials-list">
				<li>{t('aboutPage.cred1')}</li>
				<li>{t('aboutPage.cred2')}</li>
				<li>{t('aboutPage.cred3')}</li>
				<li>{t('aboutPage.cred4')}</li>
			</ul>
		</div>

		<div class="cta-block" use:reveal>
			<h3>{t('aboutPage.ctaTitle')}</h3>
			<p>{t('aboutPage.ctaDescription')}</p>
			<a href={localePath('/#contact', locale)} class="cta-primary">{t('aboutPage.ctaButton')}</a>
		</div>
	</div>
</section>

<style>
	.about-hero {
		padding: 160px 0 80px;
		background: var(--white);
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: var(--gray);
		margin-bottom: 40px;
	}

	.breadcrumb a {
		color: var(--gray);
		text-decoration: none;
		transition: color 0.3s;
	}

	.breadcrumb a:hover {
		color: var(--secondary);
	}

	.about-hero h1 {
		font-family: var(--font-serif);
		font-size: 56px;
		font-weight: 400;
		color: var(--primary);
		margin-bottom: 16px;
		line-height: 1.2;
	}

	.subtitle {
		font-size: 20px;
		color: var(--gray);
		font-weight: 300;
		line-height: 1.6;
	}

	.about-body {
		padding: 0 0 140px;
		background: var(--white);
	}

	.about-layout {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 80px;
		align-items: start;
		margin-bottom: 100px;
	}

	.about-photo {
		position: relative;
		overflow: hidden;
	}

	.about-photo img {
		width: 100%;
		height: auto;
		display: block;
		filter: grayscale(20%);
	}

	.about-text p {
		font-size: 16px;
		line-height: 1.9;
		color: var(--gray);
		font-weight: 300;
		margin-bottom: 24px;
	}

	.about-text p:last-child {
		margin-bottom: 0;
	}

	.philosophy {
		padding: 80px 0;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		margin-bottom: 80px;
	}

	.philosophy h2 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
		color: var(--primary);
		margin-bottom: 32px;
	}

	.philosophy p {
		font-size: 16px;
		line-height: 1.9;
		color: var(--gray);
		font-weight: 300;
		margin-bottom: 24px;
	}

	.philosophy p:last-child {
		margin-bottom: 0;
	}

	.credentials-section {
		margin-bottom: 100px;
	}

	.credentials-section h2 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
		color: var(--primary);
		margin-bottom: 32px;
	}

	.credentials-list {
		list-style: none;
	}

	.credentials-list li {
		padding: 16px 0;
		color: var(--gray);
		font-size: 16px;
		font-weight: 300;
		position: relative;
		padding-left: 28px;
		border-bottom: 1px solid var(--border);
	}

	.credentials-list li:first-child {
		border-top: 1px solid var(--border);
	}

	.credentials-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 10px;
		height: 1px;
		background: var(--secondary);
	}

	.cta-block {
		background: var(--light);
		padding: 80px;
		text-align: center;
	}

	.cta-block h3 {
		font-family: var(--font-serif);
		font-size: 32px;
		font-weight: 400;
		color: var(--primary);
		margin-bottom: 16px;
	}

	.cta-block p {
		color: var(--gray);
		font-size: 16px;
		font-weight: 300;
		margin-bottom: 40px;
		line-height: 1.6;
	}

	@media (max-width: 968px) {
		.about-hero { padding: 120px 0 60px; }
		.about-hero h1 { font-size: 36px; }
		.about-layout { grid-template-columns: 1fr; gap: 40px; }
		.about-photo { max-width: 300px; }
		.philosophy { padding: 60px 0; }
		.cta-block { padding: 48px 24px; }
	}
</style>
