<script lang="ts">
	import { createT, localePath } from '$lib/i18n';
	import { reveal } from '$lib/actions/reveal';

	let { data } = $props();

	const locale = $derived(data.locale);
	const t = $derived(createT(locale, data.overrides));

	const placeholderCases = [
		{
			category: 'Drept Penal',
			date: '12 Martie 2025',
			title: 'Achitare în dosar de evaziune fiscală — prejudiciu de 2,4 mil. EUR',
			excerpt: 'Client acuzat de constituirea unui grup infracțional organizat și evaziune fiscală. Prin identificarea viciilor procedurale și contestarea probelor administrate nelegal, s-a obținut achitarea pe toate capetele de acuzare.',
			tag: 'Achitare'
		},
		{
			category: 'Drept Penal',
			date: '8 Octombrie 2024',
			title: 'Suspendarea urmăririi penale — dosar de corupție în sector public',
			excerpt: 'Reprezentare în faza de urmărire penală pentru un funcționar public acuzat de luare de mită. Contestarea actelor de urmărire și demonstrarea lipsei elementului subiectiv au condus la clasarea cauzei.',
			tag: 'Clasare'
		},
		{
			category: 'Drept Penal',
			date: '22 Iunie 2024',
			title: 'Reducerea pedepsei de la 6 ani la 2 ani cu suspendare — recurs reușit',
			excerpt: 'Recurs formulat împotriva unei condamnări definitive pentru furt calificat. Prin invocarea circumstanțelor atenuante și analiza individualizării judiciare, pedeapsa a fost redusă substanțial cu suspendare sub supraveghere.',
			tag: 'Recurs admis'
		}
	];

	const otherDomains = [
		{ key: 'civil', icon: '⚖' },
		{ key: 'maritime', icon: '⚓' },
		{ key: 'realestate', icon: '🏛' }
	];

	const services = [
		'Apărare în faza de cercetare și urmărire penală',
		'Asistență la audieri și percheziții domiciliare',
		'Contestarea măsurilor preventive (reținere, arest)',
		'Reprezentare în instanță la toate nivelurile',
		'Formularea căilor de atac (apel, recurs, revizuire)',
		'Infracțiuni economice, fraudă și corupție',
		'Dosare cu impact public și mediatizare intensă',
		'Acorduri de recunoaștere a vinovăției'
	];
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
	<title>[Preview] Domeniu de Practică | Cabinet Avocat Cornaciu</title>
</svelte:head>

<!-- ─── Hero ──────────────────────────────────────────── -->
<section class="domain-hero">
	<div class="container">
		<div class="breadcrumb">
			<a href={localePath('/', locale)}>Acasă</a>
			<span>/</span>
			<span>Domenii de Practică</span>
			<span>/</span>
			<span>Drept Penal</span>
		</div>
		<span class="domain-tag">Domeniu de Practică</span>
		<h1>Drept Penal și<br>Apărare Strategică</h1>
		<p class="hero-description">
			Apărare penală de nivel înalt în toate fazele procesului — de la cercetare și urmărire penală
			până la judecată și căile de atac. Experiență dovedită în dosare complexe, infracțiuni
			economice și cazuri cu impact public.
		</p>
		<div class="hero-actions">
			<a href={localePath('/#contact', locale)} class="btn-primary">Consultație Gratuită</a>
			<a href={localePath('/studii-de-caz', locale)} class="btn-ghost">Studii de Caz →</a>
		</div>
	</div>
</section>

<!-- ─── Overview ──────────────────────────────────────── -->
<section class="overview">
	<div class="container">
		<div class="overview-header" use:reveal>
			<h2>Ce acoperă acest domeniu</h2>
		</div>
		<ul class="services-list" use:reveal>
			{#each services as item}
				<li>{item}</li>
			{/each}
		</ul>
	</div>
</section>

<!-- ─── Case Studies ──────────────────────────────────── -->
<section class="cases-section">
	<div class="container">
		<div class="section-header" use:reveal>
			<span class="section-label">Rezultate Demonstrate</span>
			<h2 class="section-title">Studii de Caz</h2>
			<p class="section-description">Exemple concrete din practica noastră juridică în domeniul dreptului penal.</p>
		</div>
		<div class="cases-grid">
			{#each placeholderCases as cs, i}
				<div class="case-card">
					<div class="case-image">
					{#if i === 0}
						<img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&w=600&h=380&fit=crop&q=80" alt={cs.title} loading="lazy" />
					{:else if i === 1}
						<img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&w=600&h=380&fit=crop&q=80" alt={cs.title} loading="lazy" />
					{:else}
						<img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&w=600&h=380&fit=crop&q=80" alt={cs.title} loading="lazy" />
					{/if}
						<span class="case-tag">{cs.tag}</span>
					</div>
					<div class="case-content">
						<div class="case-meta">
							<span class="case-date">{cs.date}</span>
							<span class="case-category">{cs.category}</span>
						</div>
						<h3>{cs.title}</h3>
						<p>{cs.excerpt}</p>
						<span class="case-link">Citește cazul →</span>
					</div>
				</div>
			{/each}
		</div>
		<div class="cases-footer" use:reveal>
			<a href={localePath('/studii-de-caz', locale)} class="view-all-link">
				Vezi Toate Studiile de Caz →
			</a>
		</div>
	</div>
</section>

<!-- ─── Other Domains ─────────────────────────────────── -->
<section class="other-domains">
	<div class="container">
		<div class="other-header" use:reveal>
			<h2>Alte Domenii de Practică</h2>
			<p>Asistență juridică specializată în multiple ramuri ale dreptului.</p>
		</div>
		<div class="other-grid" use:reveal>
			{#each otherDomains as domain}
				<a href={localePath('/temp', locale)} class="other-card">
					<span class="other-icon">{domain.icon}</span>
					<h3>{t(`expertise.${domain.key}`)}</h3>
					<p>{t(`expertise.${domain.key}Desc`)}</p>
					<span class="other-link">Detalii →</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Bottom CTA ────────────────────────────────────── -->
<section class="bottom-cta">
	<div class="container">
		<div class="cta-inner" use:reveal>
			<h2>Aveți nevoie de reprezentare juridică?</h2>
			<p>Contactați-ne pentru o consultație gratuită și discretă. Evaluăm situația dumneavoastră și vă prezentăm opțiunile disponibile.</p>
			<a href={localePath('/#contact', locale)} class="btn-primary">Consultație Gratuită</a>
		</div>
	</div>
</section>

<style>
	/* ── Hero ──────────────────────────────────────────── */

	.domain-hero {
		padding: 160px 0 100px;
		background: var(--primary);
		position: relative;
	}

	.domain-hero::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--secondary);
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.45);
		margin-bottom: 48px;
	}

	.breadcrumb a {
		color: rgba(255, 255, 255, 0.45);
		text-decoration: none;
		transition: color 0.3s;
	}

	.breadcrumb a:hover {
		color: var(--secondary);
	}

	.breadcrumb span {
		color: rgba(255, 255, 255, 0.25);
	}

	.domain-tag {
		display: block;
		font-size: 11px;
		letter-spacing: 3px;
		text-transform: uppercase;
		font-weight: 600;
		color: var(--secondary);
		margin-bottom: 24px;
	}

	.domain-hero h1 {
		font-family: var(--font-serif);
		font-size: 72px;
		font-weight: 400;
		line-height: 1.1;
		color: var(--white);
		margin-bottom: 32px;
		max-width: 720px;
	}

	.hero-description {
		font-size: 18px;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.68);
		font-weight: 300;
		max-width: 640px;
		margin-bottom: 48px;
	}

	.hero-actions {
		display: flex;
		gap: 20px;
		align-items: center;
	}

	.btn-primary {
		display: inline-block;
		padding: 16px 40px;
		background: var(--secondary);
		color: var(--white);
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0.5px;
		text-decoration: none;
		font-family: var(--font-sans);
		transition: background 0.3s;
	}

	.btn-primary:hover {
		background: var(--accent);
	}

	.btn-ghost {
		display: inline-block;
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.6);
		text-decoration: none;
		letter-spacing: 0.3px;
		transition: color 0.3s;
		padding: 16px 0;
	}

	.btn-ghost:hover {
		color: var(--white);
	}

	/* ── Overview ──────────────────────────────────────── */

	.overview {
		padding: 100px 0;
		background: var(--white);
	}

	.overview-header {
		margin-bottom: 48px;
	}

	.overview-header h2 {
		font-family: var(--font-serif);
		font-size: 40px;
		font-weight: 400;
		color: var(--primary);
	}

	.services-list {
		list-style: none;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0 80px;
	}

	.services-list li {
		padding: 14px 0;
		font-size: 15px;
		color: var(--gray);
		font-weight: 300;
		border-bottom: 1px solid var(--border);
		padding-left: 20px;
		position: relative;
	}

	.services-list li:nth-child(odd):nth-last-child(1),
	.services-list li:nth-child(odd):nth-last-child(1) ~ li,
	.services-list li:first-child,
	.services-list li:nth-child(2) {
		border-top: 1px solid var(--border);
	}

	.services-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 8px;
		height: 1px;
		background: var(--secondary);
	}

	.btn-primary-outline {
		display: inline-block;
		padding: 14px 36px;
		border: 1.5px solid var(--primary);
		color: var(--primary);
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0.3px;
		text-decoration: none;
		font-family: var(--font-sans);
		transition: all 0.3s;
	}

	.btn-primary-outline:hover {
		background: var(--primary);
		color: var(--white);
	}

	/* ── Case Studies ──────────────────────────────────── */

	.cases-section {
		padding: 120px 0;
		background: var(--light);
	}

	.cases-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}

	.case-card {
		background: var(--white);
		border: 1px solid var(--border);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: border-color 0.3s;
	}

	.case-card:hover {
		border-color: var(--secondary);
	}

	.case-image {
		height: 220px;
		position: relative;
		overflow: hidden;
	}

	.case-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.5s ease;
	}

	.case-card:hover .case-image img {
		transform: scale(1.04);
	}

	.case-tag {
		position: absolute;
		bottom: 16px;
		left: 20px;
		display: inline-block;
		background: var(--secondary);
		color: var(--white);
		font-size: 11px;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		font-weight: 600;
		padding: 5px 12px;
	}

	.case-content {
		padding: 28px 28px 32px;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.case-meta {
		display: flex;
		gap: 16px;
		margin-bottom: 16px;
		font-size: 12px;
	}

	.case-date {
		color: var(--gray);
	}

	.case-category {
		color: var(--secondary);
		font-weight: 500;
	}

	.case-content h3 {
		font-family: var(--font-serif);
		font-size: 20px;
		font-weight: 500;
		color: var(--primary);
		margin-bottom: 12px;
		line-height: 1.4;
	}

	.case-content p {
		font-size: 14px;
		line-height: 1.8;
		color: var(--gray);
		font-weight: 300;
		flex: 1;
		margin-bottom: 20px;
	}

	.case-link {
		font-size: 13px;
		font-weight: 500;
		color: var(--secondary);
		letter-spacing: 0.3px;
	}

	.cases-footer {
		text-align: center;
		margin-top: 56px;
	}

	.view-all-link {
		font-size: 15px;
		font-weight: 500;
		color: var(--primary);
		text-decoration: none;
		letter-spacing: 0.3px;
		border-bottom: 1px solid var(--secondary);
		padding-bottom: 2px;
		transition: color 0.3s;
	}

	.view-all-link:hover {
		color: var(--secondary);
	}

	/* ── Other Domains ─────────────────────────────────── */

	.other-domains {
		padding: 100px 0;
		background: var(--white);
		border-top: 1px solid var(--border);
	}

	.other-header {
		margin-bottom: 56px;
	}

	.other-header h2 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
		color: var(--primary);
		margin-bottom: 12px;
	}

	.other-header p {
		font-size: 15px;
		color: var(--gray);
		font-weight: 300;
	}

	.other-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		background: var(--border);
		border: 1px solid var(--border);
	}

	.other-card {
		padding: 40px 36px;
		background: var(--white);
		text-decoration: none;
		display: flex;
		flex-direction: column;
		transition: background 0.3s;
		position: relative;
	}

	.other-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 2px;
		background: var(--secondary);
		transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.other-card:hover {
		background: var(--light);
	}

	.other-card:hover::before {
		width: 100%;
	}

	.other-icon {
		font-size: 24px;
		margin-bottom: 16px;
		display: block;
	}

	.other-card h3 {
		font-family: var(--font-serif);
		font-size: 22px;
		font-weight: 500;
		color: var(--primary);
		margin-bottom: 10px;
	}

	.other-card p {
		font-size: 13px;
		line-height: 1.7;
		color: var(--gray);
		font-weight: 300;
		flex: 1;
		margin-bottom: 16px;
	}

	.other-link {
		font-size: 12px;
		font-weight: 500;
		color: var(--secondary);
		letter-spacing: 0.3px;
	}

	/* ── Bottom CTA ────────────────────────────────────── */

	.bottom-cta {
		padding: 120px 0;
		background: var(--primary);
	}

	.cta-inner {
		max-width: 700px;
		margin: 0 auto;
		text-align: center;
	}

	.cta-inner h2 {
		font-family: var(--font-serif);
		font-size: 48px;
		font-weight: 400;
		color: var(--white);
		margin-bottom: 20px;
		line-height: 1.2;
	}

	.cta-inner p {
		font-size: 16px;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.65);
		font-weight: 300;
		margin-bottom: 40px;
	}

	/* ── Responsive ────────────────────────────────────── */

	@media (max-width: 1100px) {
		.overview-grid {
			gap: 60px;
		}
	}

	@media (max-width: 968px) {
		.domain-hero {
			padding: 130px 0 72px;
		}

		.domain-hero h1 {
			font-size: 48px;
		}

		.overview {
			padding: 72px 0;
		}

		.services-list {
			grid-template-columns: 1fr;
		}

		.services-list li:nth-child(2) {
			border-top: none;
		}

		.cases-section {
			padding: 72px 0;
		}

		.cases-footer {
			margin-top: 40px;
		}

		.cases-grid {
			grid-template-columns: 1fr 1fr;
		}

		.other-domains {
			padding: 72px 0;
		}

		.other-grid {
			grid-template-columns: 1fr 1fr;
		}

		.bottom-cta {
			padding: 80px 0;
		}
	}

	@media (max-width: 640px) {
		.domain-hero {
			padding: 130px 0 56px;
		}

		.domain-hero h1 {
			font-size: 32px;
		}

		.hero-description {
			font-size: 15px;
			margin-bottom: 32px;
		}

		.hero-actions {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}

		.overview {
			padding: 56px 0;
		}

		.overview-header {
			margin-bottom: 28px;
		}

		.overview-header h2 {
			font-size: 28px;
		}

		.cases-section {
			padding: 56px 0;
		}

		.cases-footer {
			margin-top: 32px;
		}

		.cases-grid {
			grid-template-columns: 1fr;
		}

		.other-domains {
			padding: 56px 0;
		}

		.other-header {
			margin-bottom: 32px;
		}

		.other-grid {
			grid-template-columns: 1fr;
		}

		.bottom-cta {
			padding: 64px 0;
		}

		.cta-inner h2 {
			font-size: 28px;
		}
	}
</style>
