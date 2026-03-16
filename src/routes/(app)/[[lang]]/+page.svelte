<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ExpertiseGrid from '$lib/components/ExpertiseGrid.svelte';
	import Results from '$lib/components/Results.svelte';
	import About from '$lib/components/About.svelte';
	import Testimonials from '$lib/components/Testimonials.svelte';
	import Approach from '$lib/components/Approach.svelte';
	import ArticleCards from '$lib/components/ArticleCards.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import { createT, localePath } from '$lib/i18n';

	let { data } = $props();

	const locale = $derived(data.locale);
	const t = $derived(createT(locale));

	const fallbackTestimonials = [
		{
			id: 1,
			quote: 'Profesionalism excepțional și o abordare strategică care a făcut diferența în cazul nostru. Recomand cu încredere serviciile acestui cabinet.',
			authorName: 'Adrian Popescu',
			authorTitle: 'Director General, S.C. Tech Solutions',
			rating: 5
		},
		{
			id: 2,
			quote: 'Expertiză juridică de nivel superior, comunicare excelentă și rezultate care au depășit așteptările. O colaborare pe care o recomand fără rezerve.',
			authorName: 'Elena Ionescu',
			authorTitle: 'Antreprenor',
			rating: 5
		},
		{
			id: 3,
			quote: 'Dedicare totală și atenție la detalii în tratarea cazului meu. Am apreciat transparența și profesionalismul pe tot parcursul procesului.',
			authorName: 'Mihai Constantin',
			authorTitle: 'Manager Regional',
			rating: 5
		}
	];

	const testimonials = $derived(data.testimonials.length > 0 ? data.testimonials : fallbackTestimonials);
</script>

<Seo {locale} title={t('seo.defaultTitle')} description={t('seo.defaultDescription')} url="https://cornaciu.ro{localePath('/', locale)}" />

<Hero {locale} {t} />
<ExpertiseGrid {locale} {t} />
<Results {locale} {t} />
<About {locale} {t} />
<Testimonials {testimonials} {locale} {t} />
<Approach {locale} {t} />
<ArticleCards articles={data.articles} {locale} {t} />
<ContactSection {locale} {t} />
