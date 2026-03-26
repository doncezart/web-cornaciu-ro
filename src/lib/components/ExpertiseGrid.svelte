<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { localePath } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';

	interface Props {
		locale: Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
		expertiseOrder?: string[];
	}

	let { locale, t, expertiseOrder }: Props = $props();

	const defaultOrder = ['civil', 'commercial', 'family', 'realestate', 'labor'];
	const areaKeys = $derived(expertiseOrder && expertiseOrder.length > 0 ? expertiseOrder : defaultOrder);
</script>

<section id="experienta" class="expertise">
	<div class="container-narrow">
		<div class="section-header animate-in" use:reveal>
			<span class="section-label">{t('expertise.label')}</span>
			<h2 class="section-title">{t('expertise.title')}</h2>
			<p class="section-description">{t('expertise.description')}</p>
		</div>
		<div class="expertise-grid" use:reveal>
			{#each areaKeys as key, i}
				<div class="expertise-item animate-in">
					<div class="expertise-number">{String(i + 1).padStart(2, '0')}</div>
					<h3>{t(`expertise.${key}`)}</h3>
					<p>{t(`expertise.${key}Desc`)}</p>
				</div>
			{/each}
			<a href={localePath('/despre', locale)} class="expertise-cta animate-in">
				<span class="cta-text">{t('expertise.ctaButton')}</span>
			</a>
		</div>
	</div>
</section>

<style>
	.expertise {
		padding: 140px 0;
		background: var(--white);
	}

	.expertise-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: var(--border);
		border: 1px solid var(--border);
	}

	.expertise-item {
		padding: 56px 48px;
		background: var(--white);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
	}

	.expertise-item::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 2px;
		background: var(--secondary);
		transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.expertise-item:hover {
		background: var(--light);
	}

	.expertise-item:hover::before {
		width: 100%;
	}

	.expertise-number {
		font-family: var(--font-serif);
		font-size: 18px;
		color: var(--secondary);
		margin-bottom: 24px;
		font-weight: 300;
	}

	.expertise-item h3 {
		font-family: var(--font-serif);
		font-size: 28px;
		margin-bottom: 16px;
		color: var(--primary);
		font-weight: 500;
	}

	.expertise-item p {
		color: var(--gray);
		line-height: 1.8;
		font-size: 15px;
		font-weight: 300;
	}

	.expertise-cta {
		padding: 56px 48px;
		background: var(--primary);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 24px;
		text-decoration: none;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
	}

	.expertise-cta::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 2px;
		background: var(--accent);
		transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.expertise-cta:hover {
		background: var(--secondary);
	}

	.expertise-cta:hover::before {
		width: 100%;
	}

	.cta-text {
		font-family: var(--font-sans);
		font-size: 18px;
		font-weight: 500;
		color: var(--white);
		text-align: center;
		line-height: 1.4;
		letter-spacing: 0.3px;
	}

	@media (max-width: 968px) {
		.expertise { padding: 80px 0; }
		.expertise-grid { grid-template-columns: 1fr; }
	}
</style>
