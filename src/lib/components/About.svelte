<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { Locale } from '$lib/i18n';

	interface Props {
		locale: Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	let { locale, t }: Props = $props();
</script>

<section id="despre" class="about">
	<div class="container">
		<div class="about-grid">
			<div class="about-content animate-in" use:reveal>
				<span class="section-label">{t('about.label')}</span>
				<h2>{t('about.title')}</h2>
				<p>{t('about.p1')}</p>
				<p>{t('about.p2')}</p>
				<p>{t('about.p3')}</p>
				<div class="credentials">
					<h4>{t('about.credentialsTitle')}</h4>
					<ul>
						<li>{t('about.cred1')}</li>
						<li>{t('about.cred2')}</li>
						<li>{t('about.cred3')}</li>
						<li>{t('about.cred4')}</li>
					</ul>
				</div>
			</div>
			<div class="about-image-wrapper animate-in" use:reveal>
				<div class="about-image">
					<img src="/cornaciu2.png" alt="Avocat Cornaciu Cătălin în birou" />
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.about {
		padding: 140px 0;
		background: var(--light);
	}

	.about-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 100px;
		align-items: center;
	}

	.about-content h2 {
		font-family: var(--font-serif);
		font-size: 48px;
		margin-bottom: 32px;
		color: var(--primary);
		font-weight: 400;
		line-height: 1.3;
	}

	.about-content p {
		margin-bottom: 24px;
		font-size: 16px;
		line-height: 1.9;
		color: var(--gray);
		font-weight: 300;
	}

	.credentials {
		margin-top: 48px;
		padding-top: 48px;
		border-top: 1px solid var(--border);
	}

	.credentials h4 {
		font-size: 14px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: var(--secondary);
		margin-bottom: 20px;
		font-weight: 600;
	}

	.credentials ul {
		list-style: none;
	}

	.credentials li {
		padding: 12px 0;
		color: var(--gray);
		font-size: 15px;
		position: relative;
		padding-left: 24px;
		font-weight: 300;
	}

	.credentials li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 8px;
		height: 1px;
		background: var(--secondary);
	}

	.about-image {
		width: 100%;
		height: 600px;
		position: relative;
		overflow: hidden;
	}

	.about-image::after {
		content: '';
		position: absolute;
		inset: 0;
		border: 1px solid var(--border);
		pointer-events: none;
	}

	.about-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (max-width: 968px) {
		.about { padding: 80px 0; }
		.about-grid { grid-template-columns: 1fr; gap: 60px; }
		.about-image { height: auto; }
	}
</style>
