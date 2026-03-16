<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { localePath, locales, localeFlags, localeNames, type Locale } from '$lib/i18n';
	import { page } from '$app/state';

	interface Props {
		locale: Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	let { locale, t }: Props = $props();

	let scrolled = $state(false);
	let mobileOpen = $state(false);
	let langOpen = $state(false);

	function handleScroll() {
		scrolled = window.scrollY > 100;
	}

	function closeMobile() {
		mobileOpen = false;
	}

	function closeLang() {
		langOpen = false;
	}

	/** Build current path for another locale */
	function switchLocalePath(target: Locale): string {
		const pathname = page.url.pathname;
		// Strip current locale prefix
		let path: string = pathname;
		if (locale !== 'ro') {
			path = pathname.replace(new RegExp(`^/${locale}(/|$)`), '/');
		}
		return localePath(path, target);
	}

	afterNavigate(({ to }) => {
		if (to?.url.hash) {
			setTimeout(() => {
				const el = document.querySelector(to.url.hash);
				if (el) el.scrollIntoView({ behavior: 'smooth' });
			}, 100);
		}
	});
</script>

<svelte:window onscroll={handleScroll} onclick={closeLang} />

<nav class:scrolled>
	<div class="container">
		<div class="nav-content">
			<a href={localePath('/', locale)} class="logo">
				<svg class="logo-icon" viewBox="0 0 24 24" fill="none">
					<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" stroke="currentColor" fill="none" />
				</svg>
				Cornaciu
			</a>
			<ul class="nav-links" class:mobile-open={mobileOpen}>
				<li><a href="{localePath('/', locale)}#despre" onclick={closeMobile}>{t('nav.about')}</a></li>
				<li><a href="{localePath('/', locale)}#experienta" onclick={closeMobile}>{t('nav.expertise')}</a></li>
				<li><a href="{localePath('/', locale)}#abordare" onclick={closeMobile}>{t('nav.approach')}</a></li>
				<li><a href={localePath('/articole', locale)} onclick={closeMobile}>{t('nav.articles')}</a></li>
				<li><a href="{localePath('/', locale)}#contact" onclick={closeMobile}>{t('nav.contact')}</a></li>
			</ul>

			<div class="nav-right">
				<div class="lang-switcher" onclick={(e) => { e.stopPropagation(); langOpen = !langOpen; }} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); langOpen = !langOpen; }}} role="button" tabindex="0" aria-label="Switch language">
					<img class="lang-flag" src={localeFlags[locale]} alt={locale} />
					<span class="lang-code">{locale.toUpperCase()}</span>
					<svg class="lang-arrow" class:open={langOpen} viewBox="0 0 12 12" fill="none"><path d="M3 5l3 3 3-3" stroke="currentColor" stroke-width="1.5"/></svg>
					{#if langOpen}
						<div class="lang-dropdown">
							{#each locales.filter(l => l !== locale) as l}
								<a href={switchLocalePath(l)} class="lang-option" onclick={closeLang}>
								<img class="lang-flag" src={localeFlags[l]} alt={l} />
									<span>{localeNames[l]}</span>
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<button class="hamburger" aria-label={t('nav.menuLabel')} onclick={() => mobileOpen = !mobileOpen}>
					<span></span><span></span><span></span>
				</button>
				<a href="{localePath('/', locale)}#contact" class="cta-nav">{t('nav.cta')}</a>
			</div>
		</div>
	</div>
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		width: 100%;
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(20px);
		z-index: 1000;
		border-bottom: 1px solid var(--border);
		transition: 0.4s;
	}

	nav.scrolled {
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	.nav-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px 0;
	}

	.logo {
		font-family: var(--font-serif);
		font-size: 26px;
		font-weight: 600;
		color: var(--primary);
		display: flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
	}

	.logo-icon {
		width: 32px;
		height: 32px;
		stroke: var(--secondary);
		stroke-width: 1.5;
	}

	.nav-links {
		display: flex;
		gap: 48px;
		list-style: none;
	}

	.nav-links a {
		text-decoration: none;
		color: var(--primary);
		font-weight: 500;
		font-size: 15px;
		letter-spacing: 0.3px;
		transition: color 0.3s ease;
	}

	.nav-links a:hover {
		color: var(--secondary);
	}

	.cta-nav {
		background: var(--primary);
		color: #fff;
		padding: 14px 32px;
		font-size: 15px;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.cta-nav:hover {
		background: var(--secondary);
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.lang-switcher {
		position: relative;
		display: flex;
		align-items: center;
		gap: 6px;
		cursor: pointer;
		padding: 8px 12px;
		border: 1px solid var(--border);
		font-size: 13px;
		font-weight: 500;
		color: var(--primary);
		user-select: none;
	}

	.lang-flag {
		width: 20px;
		height: 14px;
		object-fit: cover;
		border-radius: 2px;
	}

	.lang-code {
		letter-spacing: 0.5px;
	}

	.lang-arrow {
		width: 12px;
		height: 12px;
		transition: transform 0.2s ease;
	}

	.lang-arrow.open {
		transform: rotate(180deg);
	}

	.lang-dropdown {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		background: white;
		border: 1px solid var(--border);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
		z-index: 100;
		min-width: 150px;
	}

	.lang-option {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 16px;
		color: var(--primary);
		text-decoration: none;
		font-size: 14px;
		transition: background 0.2s ease;
	}

	.lang-option:hover {
		background: var(--light);
	}

	.hamburger {
		display: none;
		flex-direction: column;
		gap: 4px;
		cursor: pointer;
		background: none;
		border: none;
		padding: 8px;
	}

	.hamburger span {
		width: 26px;
		height: 3px;
		background: var(--primary);
		border-radius: 2px;
		transition: 0.3s;
	}

	@media (max-width: 968px) {
		.nav-links {
			display: none;
			flex-direction: column;
			gap: 24px;
			background: white;
			position: absolute;
			top: 80px;
			right: 20px;
			padding: 20px;
			border: 1px solid var(--border);
			z-index: 999;
		}

		.nav-links.mobile-open {
			display: flex;
		}

		.cta-nav {
			display: none;
		}

		.hamburger {
			display: flex;
		}
	}
</style>
