<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import type { Locale } from '$lib/i18n';

	interface Props {
		locale: Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	let { locale, t }: Props = $props();
</script>

<section id="contact" class="contact">
	<div class="container">
		<div class="section-header animate-in" use:reveal>
			<span class="section-label">{t('contact.label')}</span>
			<h2 class="section-title">{t('contact.title')}</h2>
			<p class="section-description">{t('contact.description')}</p>
		</div>
		<div class="contact-grid" use:reveal>
			<div class="contact-info animate-in">
				<div class="contact-item">
					<div class="contact-label">{t('contact.address')}</div>
					<div class="contact-value">
						Strada Trandafirilor nr. 3, Etaj 3<br />
						Piata Centrala Giurgiu, Romania
					</div>
				</div>
				<div class="contact-item">
					<div class="contact-label">{t('contact.phone')}</div>
					<div class="contact-value">
						<a href="tel:+40723370737">+40 723 370 737</a>
					</div>
				</div>
				<div class="contact-item">
					<div class="contact-label">{t('contact.email')}</div>
					<div class="contact-value">
						<a href="mailto:office@cornaciu.ro">office@cornaciu.ro</a><br />
						<a href="mailto:secretariat@cornaciu.ro">secretariat@cornaciu.ro</a>
					</div>
				</div>
			</div>
			<div class="map-wrapper animate-in">
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d285.123456!2d25.9671307!3d43.8912943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f16!3m3!1m2!1s0x40ae6729fbbc946b%3A0xf7bd37680903b2e9!2sAvocat%20Cornaciu%20C%C4%83t%C4%83lin!5e0!3m2!1sen!2s!4v1696425600000!5m2!1sen!2s"
					allowfullscreen
					loading="lazy"
					title={t('contact.mapTitle')}
				></iframe>
			</div>
		</div>
	</div>
</section>

<style>
	.contact {
		padding: 140px 0;
		background: var(--primary);
		color: var(--white);
	}

	.contact :global(.section-label),
	.contact :global(.section-description) {
		color: rgba(255, 255, 255, 0.7);
	}

	.contact :global(.section-title) {
		color: var(--white);
	}

	.contact-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 100px;
		margin-top: 80px;
	}

	.contact-item {
		padding: 40px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.contact-item:first-child {
		padding-top: 0;
	}

	.contact-label {
		font-size: 12px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 12px;
		font-weight: 600;
	}

	.contact-value {
		font-size: 20px;
		color: var(--white);
		font-weight: 300;
		line-height: 1.6;
	}

	.contact-value a {
		color: var(--white);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.contact-value a:hover {
		color: var(--accent);
	}

	.map-wrapper {
		height: 500px;
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.map-wrapper iframe {
		width: 100%;
		height: 100%;
		filter: grayscale(100%) invert(92%) contrast(83%);
	}

	@media (max-width: 968px) {
		.contact { padding: 80px 0; }
		.contact-grid { grid-template-columns: 1fr; gap: 60px; }
	}
</style>
