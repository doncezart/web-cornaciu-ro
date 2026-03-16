<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { createT } from '$lib/i18n';

	let { children, data } = $props();

	const t = $derived(createT(data.locale));
</script>

<a href="#main-content" class="skip-link">{t('skipLink')}</a>

<Nav locale={data.locale} {t} />
<main id="main-content">
	{@render children()}
</main>
<Footer locale={data.locale} {t} />
<CookieConsent locale={data.locale} {t} />
