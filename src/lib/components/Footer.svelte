<script lang="ts">
	import { localePath, type Locale } from '$lib/i18n';

	interface Props {
		locale: Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	let { locale, t }: Props = $props();
</script>

<footer>
	<div class="container">
		<div class="footer-grid">
			<div class="footer-brand">
				<h3>Cornaciu</h3>
				<p>{t('footer.brand')}</p>
			</div>
			<div class="footer-column">
				<h4>{t('footer.navTitle')}</h4>
				<ul class="footer-links">
					<li><a href="{localePath('/', locale)}#despre">{t('footer.aboutCabinet')}</a></li>
					<li><a href="{localePath('/', locale)}#experienta">{t('nav.expertise')}</a></li>
					<li><a href="{localePath('/', locale)}#abordare">{t('nav.approach')}</a></li>
					<li><a href={localePath('/articole', locale)}>{t('nav.articles')}</a></li>
					<li><a href="{localePath('/', locale)}#contact">{t('nav.contact')}</a></li>
				</ul>
			</div>
			<div class="footer-column">
				<h4>{t('footer.servicesTitle')}</h4>
				<ul class="footer-links">
					<li><a href="{localePath('/', locale)}#experienta">{t('expertise.civil')}</a></li>
					<li><a href="{localePath('/', locale)}#experienta">{t('expertise.commercial')}</a></li>
					<li><a href="{localePath('/', locale)}#experienta">{t('expertise.family')}</a></li>
					<li><a href="{localePath('/', locale)}#experienta">{t('expertise.realestate')}</a></li>
					<li><a href="{localePath('/', locale)}#experienta">{t('expertise.labor')}</a></li>
					<li><a href="{localePath('/', locale)}#experienta">{t('expertise.criminal')}</a></li>
				</ul>
			</div>
			<div class="footer-column">
				<h4>{t('footer.legalTitle')}</h4>
				<ul class="footer-links">
					<li><a href={localePath('/confidentialitate', locale)}>{t('footer.privacy')}</a></li>
					<li><a href={localePath('/termeni', locale)}>{t('footer.terms')}</a></li>
					<li><a href={localePath('/gdpr', locale)}>{t('footer.gdpr')}</a></li>
				</ul>
			</div>
		</div>
		<div class="footer-bottom">
			<p>{t('footer.copyright', { year: new Date().getFullYear().toString() })}</p>
			<div class="footer-legal">
				<a href={localePath('/confidentialitate', locale)}>{t('footer.privacy')}</a>
				<a href={localePath('/termeni', locale)}>{t('footer.terms')}</a>
			</div>
		</div>
	</div>
</footer>

<style>
	footer {
		background: #0A0A0A;
		color: rgba(255, 255, 255, 0.7);
		padding: 80px 0 40px;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 80px;
		margin-bottom: 80px;
	}

	.footer-brand h3 {
		font-family: var(--font-serif);
		font-size: 28px;
		color: var(--white);
		margin-bottom: 24px;
		font-weight: 500;
	}

	.footer-brand p {
		line-height: 1.8;
		font-size: 15px;
		font-weight: 300;
	}

	.footer-column h4 {
		font-size: 14px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: var(--white);
		margin-bottom: 24px;
		font-weight: 600;
	}

	.footer-links {
		list-style: none;
	}

	.footer-links a {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		display: block;
		margin-bottom: 12px;
		font-size: 15px;
		transition: color 0.3s ease;
		font-weight: 300;
	}

	.footer-links a:hover {
		color: var(--white);
	}

	.footer-bottom {
		padding-top: 40px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
	}

	.footer-legal {
		display: flex;
		gap: 32px;
	}

	.footer-legal a {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.footer-legal a:hover {
		color: var(--white);
	}

	@media (max-width: 968px) {
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 48px;
		}

		.footer-bottom {
			flex-direction: column;
			gap: 24px;
			text-align: center;
		}
	}
</style>
