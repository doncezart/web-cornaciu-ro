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

	const defaultSecondaryAreas = ['civil', 'maritime', 'realestate'];
	const secondaryAreas = $derived(expertiseOrder && expertiseOrder.length > 0 ? expertiseOrder : defaultSecondaryAreas);
</script>

<section id="experienta" class="expertise">
	<div class="container-narrow">
		<div class="section-header animate-in" use:reveal>
			<span class="section-label">{t('expertise.label')}</span>
			<h2 class="section-title">{t('expertise.title')}</h2>
			<p class="section-description">{t('expertise.description')}</p>
		</div>

		<!-- Featured specialisations -->
		<div class="featured-wrap" use:reveal>
			<div class="featured-grid">
				<div class="featured-card featured-dark">
					<div class="featured-tag">{t('expertise.featured1Tag')}</div>
					<h3 class="featured-title">{t('expertise.featured1Title')}</h3>
					<p class="featured-desc">{t('expertise.featured1Desc')}</p>
					<ul class="featured-points">
						<li>{t('expertise.featured1Point1')}</li>
						<li>{t('expertise.featured1Point2')}</li>
						<li>{t('expertise.featured1Point3')}</li>
					</ul>
					<a href={localePath('/despre', locale)} class="featured-btn">{t('expertise.featured1Cta')}</a>
				</div>

				<div class="featured-card featured-light">
					<div class="featured-tag">{t('expertise.featured2Tag')}</div>
					<h3 class="featured-title">{t('expertise.featured2Title')}</h3>
					<p class="featured-desc">{t('expertise.featured2Desc')}</p>
					<ul class="featured-points">
						<li>{t('expertise.featured2Point1')}</li>
						<li>{t('expertise.featured2Point2')}</li>
						<li>{t('expertise.featured2Point3')}</li>
					</ul>
					<a href={localePath('/despre', locale)} class="featured-btn">{t('expertise.featured2Cta')}</a>
				</div>
			</div>
		</div>

		<!-- Secondary areas grid -->
		<div class="expertise-grid" use:reveal>
			{#each secondaryAreas as key, i}
				<div class="expertise-item animate-in">
					<div class="expertise-number">{String(i + 1).padStart(2, '0')}</div>
					<h3>{t(`expertise.${key}`)}</h3>
					<p>{t(`expertise.${key}Desc`)}</p>
					<a href={localePath('/despre', locale)} class="area-link">{t('expertise.areaLink')}</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.expertise {
		padding: 140px 0;
		background: var(--white);
	}

	/* ── Featured cards ─────────────────────────────────── */

	.featured-wrap {
		margin-bottom: 0;
	}

	.featured-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		border: 1px solid var(--border);
	}

	.featured-card {
		padding: 64px 56px;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.featured-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--secondary);
	}

	.featured-dark {
		background: var(--primary);
		border-right: 1px solid rgba(255, 255, 255, 0.08);
	}

	.featured-light {
		background: var(--light);
	}

	.featured-tag {
		font-size: 11px;
		letter-spacing: 2.5px;
		text-transform: uppercase;
		font-weight: 600;
		margin-bottom: 32px;
	}

	.featured-dark .featured-tag {
		color: var(--secondary);
	}

	.featured-light .featured-tag {
		color: var(--secondary);
	}

	.featured-title {
		font-family: var(--font-serif);
		font-size: 38px;
		font-weight: 500;
		line-height: 1.15;
		margin-bottom: 20px;
	}

	.featured-dark .featured-title {
		color: var(--white);
	}

	.featured-light .featured-title {
		color: var(--primary);
	}

	.featured-desc {
		font-size: 15px;
		line-height: 1.85;
		font-weight: 300;
		margin-bottom: 28px;
	}

	.featured-dark .featured-desc {
		color: rgba(255, 255, 255, 0.72);
	}

	.featured-light .featured-desc {
		color: var(--gray);
	}

	.featured-points {
		list-style: none;
		margin-bottom: 40px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
	}

	.featured-points li {
		font-size: 14px;
		padding-left: 18px;
		position: relative;
		font-weight: 400;
	}

	.featured-points li::before {
		content: '-';
		position: absolute;
		left: 0;
		color: var(--secondary);
		font-weight: 600;
	}

	.featured-dark .featured-points li {
		color: rgba(255, 255, 255, 0.65);
	}

	.featured-light .featured-points li {
		color: var(--gray);
	}

	.featured-btn {
		display: inline-block;
		padding: 14px 32px;
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0.3px;
		text-decoration: none;
		transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		align-self: flex-start;
		font-family: var(--font-sans);
	}

	.featured-dark .featured-btn {
		background: var(--secondary);
		color: var(--light);
		border: 1.5px solid var(--secondary);
	}

	.featured-dark .featured-btn:hover {
		background: transparent;
		color: var(--light);
		border-color: var(--light);
	}

	.featured-light .featured-btn {
		background: var(--primary);
		color: var(--white);
		border: 1.5px solid var(--primary);
	}

	.featured-light .featured-btn:hover {
		background: transparent;
		color: var(--primary);
	}

	/* ── Secondary areas grid ───────────────────────────── */

	.expertise-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: var(--border);
		border: 1px solid var(--border);
		border-top: none;
	}

	.expertise-item {
		padding: 48px 40px;
		background: var(--white);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		display: flex;
		flex-direction: column;
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
		font-size: 16px;
		color: var(--secondary);
		margin-bottom: 20px;
		font-weight: 300;
	}

	.expertise-item h3 {
		font-family: var(--font-serif);
		font-size: 24px;
		margin-bottom: 12px;
		color: var(--primary);
		font-weight: 500;
	}

	.expertise-item p {
		color: var(--gray);
		line-height: 1.8;
		font-size: 14px;
		font-weight: 300;
		flex: 1;
		margin-bottom: 20px;
	}

	.area-link {
		font-size: 13px;
		font-weight: 500;
		color: var(--secondary);
		text-decoration: none;
		letter-spacing: 0.3px;
		transition: color 0.3s ease;
	}

	.area-link:hover {
		color: var(--primary);
	}

	/* ── Responsive ─────────────────────────────────────── */

	@media (max-width: 968px) {
		.expertise {
			padding: 80px 0;
		}

		.featured-grid {
			grid-template-columns: 1fr;
		}

		.featured-dark {
			border-right: none;
			border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		}

		.featured-card {
			padding: 48px 36px;
		}

		.featured-title {
			font-size: 32px;
		}

		/* 2-column grid on tablet — much better than a single stacked list */
		.expertise-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.expertise {
			padding: 60px 0;
		}

		.featured-card {
			padding: 32px 24px;
		}

		.featured-tag {
			margin-bottom: 18px;
		}

		.featured-title {
			font-size: 26px;
			margin-bottom: 12px;
		}

		.featured-desc {
			font-size: 14px;
			margin-bottom: 18px;
		}

		.featured-points {
			gap: 8px;
			margin-bottom: 28px;
		}

		.featured-btn {
			align-self: stretch;
			text-align: center;
		}

		.expertise-grid {
			grid-template-columns: 1fr;
		}

		.expertise-item {
			padding: 32px 24px;
		}
	}
</style>
