<script lang="ts">
	import type { Locale } from '$lib/i18n';

	interface Props {
		locale: Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	let { locale, t }: Props = $props();
</script>

<section class="hero">
	<div class="container">
		<div class="hero-grid">
			<div class="hero-content">
				<span class="hero-label">{t('hero.label')}</span>
				<h1>{t('hero.title')}</h1>
				<p class="hero-description">{t('hero.description')}</p>
				<div class="hero-actions">
					<a href="#contact" class="cta-primary">{t('hero.ctaPrimary')}</a>
					<a href="#despre" class="cta-secondary">{t('hero.ctaSecondary')}</a>
				</div>
				<div class="hero-stats">
					<div class="stat">
						<span class="stat-number">35+</span>
						<span class="stat-label">{t('hero.statYears')}</span>
					</div>
					<div class="stat">
						<span class="stat-number">500+</span>
						<span class="stat-label">{t('hero.statCases')}</span>
					</div>
					<div class="stat">
						<span class="stat-number">98%</span>
						<span class="stat-label">{t('hero.statRate')}</span>
					</div>
				</div>
			</div>
			<div class="hero-image">
				<div class="hero-image-wrapper">
					<img src="/cornaciu1.png" alt="Avocat Cornaciu Cătălin" />
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding-top: 80px;
		background: linear-gradient(to bottom, var(--light) 0%, var(--white) 100%);
	}

	.hero-grid {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 80px;
		align-items: center;
		padding: 80px 0;
	}

	.hero-content {
		animation: fadeInUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	.hero-label {
		font-size: 13px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--secondary);
		font-weight: 600;
		margin-bottom: 24px;
		display: block;
	}

	h1 {
		font-family: var(--font-serif);
		font-size: 72px;
		line-height: 1.15;
		margin-bottom: 32px;
		color: var(--primary);
		font-weight: 400;
		letter-spacing: -1px;
	}

	.hero-description {
		font-size: 20px;
		line-height: 1.7;
		color: var(--gray);
		margin-bottom: 48px;
		max-width: 580px;
		font-weight: 300;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 24px;
		margin-bottom: 64px;
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 48px;
		padding-top: 48px;
		border-top: 1px solid var(--border);
	}

	.stat-number {
		font-family: var(--font-serif);
		font-size: 56px;
		font-weight: 300;
		color: var(--secondary);
		display: block;
		line-height: 1;
		margin-bottom: 8px;
	}

	.stat-label {
		font-size: 14px;
		color: var(--gray);
		letter-spacing: 0.5px;
		font-weight: 400;
	}

	.hero-image {
		animation: fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
	}

	.hero-image-wrapper {
		position: relative;
		width: 100%;
		height: 700px;
		overflow: hidden;
	}

	.hero-image-wrapper::after {
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid var(--border);
		pointer-events: none;
	}

	.hero-image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(20%);
	}

	@media (max-width: 1200px) {
		h1 { font-size: 60px; }
	}

	@media (max-width: 968px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}

		.hero-image-wrapper {
			height: auto;
		}

		.hero-image-wrapper img {
			height: auto;
		}

		h1 { font-size: 48px; }

		.hero-stats {
			grid-template-columns: 1fr;
		}

		.hero-actions {
			display: grid;
		}
	}

	@media (max-width: 480px) {
		h1 { font-size: 36px; }
		.stat-number { font-size: 40px; }
		.hero-description { font-size: 17px; }
	}
</style>
