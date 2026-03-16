<script lang="ts">
	import { browser } from '$app/environment';
	import { localePath, type Locale } from '$lib/i18n';

	interface Props {
		locale: Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	let { locale, t }: Props = $props();

	let visible = $state(false);

	if (browser) {
		visible = !localStorage.getItem('cookie-consent');
	}

	function accept() {
		localStorage.setItem('cookie-consent', 'accepted');
		visible = false;
	}

	function decline() {
		localStorage.setItem('cookie-consent', 'declined');
		visible = false;
	}
</script>

{#if visible}
	<div class="consent-banner">
		<div class="consent-content">
			<p>
				{@html t('cookie.text', {
					privacyLink: `<a href="${localePath('/confidentialitate', locale)}">${t('cookie.privacyLink')}</a>`,
					gdprLink: `<a href="${localePath('/gdpr', locale)}">${t('cookie.gdprLink')}</a>`
				})}
			</p>
			<div class="consent-actions">
				<button class="btn-accept" onclick={accept}>{t('cookie.accept')}</button>
				<button class="btn-decline" onclick={decline}>{t('cookie.decline')}</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.consent-banner {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		background: var(--primary);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding: 20px 40px;
		animation: slideUp 0.4s ease;
	}

	@keyframes slideUp {
		from { transform: translateY(100%); }
		to { transform: translateY(0); }
	}

	.consent-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 32px;
	}

	p {
		color: rgba(255, 255, 255, 0.8);
		font-size: 14px;
		line-height: 1.6;
		flex: 1;
	}

	p :global(a) {
		color: var(--accent);
		text-decoration: underline;
	}

	.consent-actions {
		display: flex;
		gap: 12px;
		flex-shrink: 0;
	}

	.btn-accept {
		padding: 10px 28px;
		background: var(--secondary);
		color: white;
		border: none;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: background 0.2s ease;
	}

	.btn-accept:hover {
		background: var(--accent);
	}

	.btn-decline {
		padding: 10px 28px;
		background: transparent;
		color: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.2);
		font-size: 14px;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: all 0.2s ease;
	}

	.btn-decline:hover {
		color: white;
		border-color: rgba(255, 255, 255, 0.5);
	}

	@media (max-width: 768px) {
		.consent-content {
			flex-direction: column;
			text-align: center;
		}

		.consent-banner {
			padding: 20px;
		}
	}
</style>
