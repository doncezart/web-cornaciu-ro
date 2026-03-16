<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { Locale } from '$lib/i18n';

	interface Props {
		locale: Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	let { locale, t }: Props = $props();

	const stepKeys = [1, 2, 3, 4] as const;
</script>

<section id="abordare" class="approach">
	<div class="container-narrow">
		<div class="section-header animate-in" use:reveal>
			<span class="section-label">{t('approach.label')}</span>
			<h2 class="section-title">{t('approach.title')}</h2>
			<p class="section-description">{t('approach.description')}</p>
		</div>
		<div class="approach-grid" use:reveal>
			{#each stepKeys as step}
				<div class="approach-item animate-in">
					<div class="approach-number">{String(step).padStart(2, '0')}</div>
					<h3>{t(`approach.step${step}Title`)}</h3>
					<p>{t(`approach.step${step}Desc`)}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.approach {
		padding: 140px 0;
		background: var(--light);
	}

	.approach-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 64px;
		margin-top: 80px;
	}

	.approach-number {
		font-family: var(--font-serif);
		font-size: 72px;
		font-weight: 300;
		color: var(--border);
		line-height: 1;
		margin-bottom: 24px;
	}

	.approach-item h3 {
		font-family: var(--font-serif);
		font-size: 32px;
		margin-bottom: 16px;
		color: var(--primary);
		font-weight: 500;
	}

	.approach-item p {
		color: var(--gray);
		line-height: 1.8;
		font-size: 15px;
		font-weight: 300;
	}

	@media (max-width: 968px) {
		.approach { padding: 80px 0; }
		.approach-grid { grid-template-columns: 1fr; gap: 48px; }
	}
</style>
