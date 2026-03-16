<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { Locale } from '$lib/i18n';

	interface Props {
		locale: Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	let { locale, t }: Props = $props();

	const stats = $derived([
		{ value: '500+', label: t('results.cases') },
		{ value: '98%', label: t('results.rate') },
		{ value: '35+', label: t('results.years') },
		{ value: '€10M+', label: t('results.recovered') }
	]);
</script>

<section class="results">
	<div class="container-narrow">
		<div class="section-header animate-in" use:reveal>
			<span class="section-label">{t('results.label')}</span>
			<h2 class="section-title">{t('results.title')}</h2>
			<p class="section-description">{t('results.description')}</p>
		</div>
		<div class="results-grid" use:reveal>
			{#each stats as stat}
				<div class="result-item animate-in">
					<span class="result-value">{stat.value}</span>
					<span class="result-label">{stat.label}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.results {
		padding: 140px 0;
		background: var(--primary);
		color: var(--white);
	}

	.results :global(.section-label),
	.results :global(.section-description) {
		color: rgba(255, 255, 255, 0.7);
	}

	.results :global(.section-title) {
		color: var(--white);
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 64px;
		margin-top: 80px;
	}

	.result-item {
		text-align: center;
	}

	.result-value {
		font-family: var(--font-serif);
		font-size: 64px;
		font-weight: 300;
		color: var(--accent);
		display: block;
		margin-bottom: 12px;
		line-height: 1;
	}

	.result-label {
		font-size: 15px;
		color: rgba(255, 255, 255, 0.8);
		letter-spacing: 0.5px;
		font-weight: 300;
	}

	@media (max-width: 968px) {
		.results { padding: 80px 0; }
		.results-grid { grid-template-columns: 1fr; }
	}
</style>
