<script lang="ts">
	import { locales, localePath, type Locale } from '$lib/i18n';

	interface Props {
		title?: string;
		description?: string;
		image?: string;
		url?: string;
		type?: string;
		locale?: Locale;
		article?: {
			publishedTime?: string;
			author?: string;
			section?: string;
			tags?: string[];
		};
	}

	const ogLocaleMap: Record<Locale, string> = {
		ro: 'ro_RO',
		en: 'en_GB',
		bg: 'bg_BG'
	};

	let {
		title = 'Cabinet Avocat Cornaciu | Excelență în Drept',
		description = 'Reprezentare juridică de nivel superior, fundamentată pe experiență vastă, rigoare profesională și dedicare absolută față de interesele clientului. Cabinet de avocatură Giurgiu.',
		image = '/og-image.jpg',
		url = 'https://cornaciu.ro',
		type = 'website',
		locale = 'ro' as Locale,
		article
	}: Props = $props();

	const siteName = 'Cabinet Avocat Cornaciu';

	/** Extract the path from a full URL to generate hreflang alternates */
	function getPath(fullUrl: string): string {
		try {
			return new URL(fullUrl).pathname;
		} catch {
			return fullUrl.startsWith('/') ? fullUrl : `/${fullUrl}`;
		}
	}

	const hreflangs = $derived(
		locales.map((l) => ({
			lang: l === 'ro' ? 'x-default' : l,
			lang2: l,
			href: `https://cornaciu.ro${localePath(getPath(url), l)}`
		}))
	);

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'LegalService',
		name: siteName,
		description,
		url: 'https://cornaciu.ro',
		telephone: '+40723370737',
		email: 'office@cornaciu.ro',
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Strada Trandafirilor nr. 3, Etaj 3',
			addressLocality: 'Giurgiu',
			addressCountry: 'RO'
		},
		priceRange: '$$',
		openingHours: 'Mo-Fr 09:00-18:00'
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={url} />

	<!-- hreflang alternates -->
	{#each hreflangs as alt}
		<link rel="alternate" hreflang={alt.lang} href={alt.href} />
		{#if alt.lang !== 'x-default'}
			<link rel="alternate" hreflang={alt.lang2} href={alt.href} />
		{/if}
	{/each}

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={ogLocaleMap[locale]} />

	{#if article}
		{#if article.publishedTime}
			<meta property="article:published_time" content={article.publishedTime} />
		{/if}
		{#if article.author}
			<meta property="article:author" content={article.author} />
		{/if}
		{#if article.section}
			<meta property="article:section" content={article.section} />
		{/if}
		{#if article.tags}
			{#each article.tags as tag}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	<!-- JSON-LD -->
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>
