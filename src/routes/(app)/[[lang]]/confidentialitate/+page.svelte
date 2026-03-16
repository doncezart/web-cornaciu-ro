<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { createT, localePath } from '$lib/i18n';

	let { data } = $props();

	const locale = $derived(data.locale);
	const t = $derived(createT(locale));
</script>

<Seo
	{locale}
	title="{t('legal.privacyTitle')} | Cabinet Avocat Cornaciu"
	description={t('legal.privacySeoDesc')}
	url="https://cornaciu.ro{localePath('/confidentialitate', locale)}"
/>

<section class="legal-header">
	<div class="container-narrow">
		<div class="breadcrumb">
			<a href={localePath('/', locale)}>{t('legal.breadcrumbHome')}</a>
			<span>/</span>
			<span>{t('legal.privacyTitle')}</span>
		</div>
		<h1>{t('legal.privacyTitle')}</h1>
		<p class="updated">{t('legal.lastUpdated')}</p>
	</div>
</section>

<section class="legal-body">
	<div class="container-narrow">
		<div class="content">
			{#if locale === 'en'}
				<h2>1. General Information</h2>
				<p>
					Cornaciu Cătălin Law Office, headquartered at Strada Trandafirilor nr. 3, Floor 3,
					Giurgiu, Romania, respects the privacy of visitors to the cornaciu.ro website and is
					committed to protecting the personal data collected.
				</p>

				<h2>2. Data Collected</h2>
				<p>We may collect the following categories of personal data:</p>
				<ul>
					<li>Identification data: name, surname, e-mail address, phone number</li>
					<li>Browsing data: IP address, browser type, pages visited, visit duration</li>
					<li>Data submitted via contact forms or e-mail</li>
				</ul>

				<h2>3. Purpose of Processing</h2>
				<p>Personal data is processed for the following purposes:</p>
				<ul>
					<li>Responding to information requests and scheduling consultations</li>
					<li>Providing requested legal services</li>
					<li>Compliance with legal obligations</li>
					<li>Improving website functionality</li>
				</ul>

				<h2>4. Legal Basis</h2>
				<p>
					Data processing is based on: your consent, the performance of a contract or
					pre-contractual steps, compliance with legal obligations, or the legitimate
					interest of the office.
				</p>

				<h2>5. Data Retention</h2>
				<p>
					Personal data is stored for the period necessary to fulfil the stated purposes,
					in compliance with the periods imposed by applicable legislation. Data associated
					with legal representation is retained in accordance with legal archiving requirements.
				</p>

				<h2>6. Your Rights</h2>
				<p>Under the General Data Protection Regulation (GDPR), you have the right to:</p>
				<ul>
					<li>Access your personal data</li>
					<li>Rectification of inaccurate data</li>
					<li>Erasure of data (right to be forgotten)</li>
					<li>Restriction of processing</li>
					<li>Data portability</li>
					<li>Object to processing</li>
					<li>Withdraw consent</li>
				</ul>

				<h2>7. Third-Party Services</h2>
				<p>
					The website uses Google Fonts for font display and Google Maps for the location map.
					These services may collect data in accordance with their own privacy policies.
				</p>

				<h2>8. Contact</h2>
				<p>
					To exercise your rights or for any questions regarding personal data processing,
					you may contact us at:
				</p>
				<p>
					<strong>E-mail:</strong> office@cornaciu.ro<br />
					<strong>Phone:</strong> +40 723 370 737<br />
					<strong>Address:</strong> Strada Trandafirilor nr. 3, Floor 3, Giurgiu, Romania
				</p>
			{:else if locale === 'bg'}
				<h2>1. Обща информация</h2>
				<p>
					Адвокатска кантора Корначу Кътълин, със седалище на ул. Трандафирилор № 3, Етаж 3,
					Джурджу, Румъния, зачита поверителността на посетителите на уебсайта cornaciu.ro и
					се ангажира да защитава събраните лични данни.
				</p>

				<h2>2. Събирани данни</h2>
				<p>Можем да събираме следните категории лични данни:</p>
				<ul>
					<li>Идентификационни данни: име, фамилия, имейл адрес, телефонен номер</li>
					<li>Данни за навигация: IP адрес, тип браузър, посетени страници, продължителност на посещението</li>
					<li>Данни, предадени чрез формуляри за контакт или имейл</li>
				</ul>

				<h2>3. Цел на обработката</h2>
				<p>Личните данни се обработват за следните цели:</p>
				<ul>
					<li>Отговор на запитвания за информация и насрочване на консултации</li>
					<li>Предоставяне на поискани правни услуги</li>
					<li>Спазване на законовите задължения</li>
					<li>Подобряване на функционалността на уебсайта</li>
				</ul>

				<h2>4. Правно основание</h2>
				<p>
					Обработката на данни се основава на: вашето съгласие, изпълнение на договор или
					преддоговорни стъпки, спазване на законовите задължения или легитимния интерес
					на кантората.
				</p>

				<h2>5. Срок на съхранение</h2>
				<p>
					Личните данни се съхраняват за периода, необходим за изпълнение на посочените цели,
					при спазване на сроковете, наложени от действащото законодателство. Данните, свързани
					с правно представителство, се съхраняват съгласно законовите изисквания за архивиране.
				</p>

				<h2>6. Вашите права</h2>
				<p>Съгласно Общия регламент за защита на данните (GDPR), имате право на:</p>
				<ul>
					<li>Достъп до личните данни</li>
					<li>Коригиране на неточни данни</li>
					<li>Изтриване на данни (право да бъдеш забравен)</li>
					<li>Ограничаване на обработката</li>
					<li>Преносимост на данните</li>
					<li>Възражение срещу обработката</li>
					<li>Оттегляне на съгласието</li>
				</ul>

				<h2>7. Услуги на трети страни</h2>
				<p>
					Уебсайтът използва Google Fonts за показване на шрифтове и Google Maps за картата на
					местоположението. Тези услуги могат да събират данни съгласно собствените си политики
					за поверителност.
				</p>

				<h2>8. Контакт</h2>
				<p>
					За упражняване на вашите права или за въпроси относно обработката на лични данни
					можете да се свържете с нас на:
				</p>
				<p>
					<strong>Имейл:</strong> office@cornaciu.ro<br />
					<strong>Телефон:</strong> +40 723 370 737<br />
					<strong>Адрес:</strong> ул. Трандафирилор № 3, Етаж 3, Джурджу, Румъния
				</p>
			{:else}
				<h2>1. Informații Generale</h2>
				<p>
					Cabinet de Avocatură Cornaciu Cătălin, cu sediul în Strada Trandafirilor nr. 3, Etaj 3,
					Giurgiu, România, respectă confidențialitatea vizitatorilor site-ului cornaciu.ro și se
					angajează să protejeze datele personale colectate.
				</p>

				<h2>2. Date Colectate</h2>
				<p>Putem colecta următoarele categorii de date personale:</p>
				<ul>
					<li>Date de identificare: nume, prenume, adresă de e-mail, număr de telefon</li>
					<li>Date de navigare: adresă IP, tipul browserului, paginile vizitate, durata vizitei</li>
					<li>Date transmise prin formulare de contact sau e-mail</li>
				</ul>

				<h2>3. Scopul Prelucrării</h2>
				<p>Datele personale sunt prelucrate în următoarele scopuri:</p>
				<ul>
					<li>Răspuns la solicitările de informații și programare consultații</li>
					<li>Furnizarea serviciilor juridice solicitate</li>
					<li>Respectarea obligațiilor legale</li>
					<li>Îmbunătățirea funcționalității site-ului</li>
				</ul>

				<h2>4. Temeiul Juridic</h2>
				<p>
					Prelucrarea datelor se bazează pe: consimțământul dumneavoastră, executarea unui contract
					sau a unor demersuri precontractuale, respectarea obligațiilor legale sau interesul legitim
					al cabinetului.
				</p>

				<h2>5. Durata Stocării</h2>
				<p>
					Datele personale sunt stocate pentru perioada necesară îndeplinirii scopurilor menționate,
					cu respectarea termenelor impuse de legislația în vigoare. Datele asociate reprezentării
					juridice sunt păstrate conform cerințelor legale privind arhivarea.
				</p>

				<h2>6. Drepturile Dumneavoastră</h2>
				<p>Conform Regulamentului General privind Protecția Datelor (GDPR), aveți dreptul la:</p>
				<ul>
					<li>Accesul la datele personale</li>
					<li>Rectificarea datelor inexacte</li>
					<li>Ștergerea datelor (dreptul de a fi uitat)</li>
					<li>Restricționarea prelucrării</li>
					<li>Portabilitatea datelor</li>
					<li>Opoziție la prelucrare</li>
					<li>Retragerea consimțământului</li>
				</ul>

				<h2>7. Servicii Terțe</h2>
				<p>
					Site-ul utilizează Google Fonts pentru afișarea fonturilor și Google Maps pentru harta locației.
					Aceste servicii pot colecta date conform propriilor politici de confidențialitate.
				</p>

				<h2>8. Contact</h2>
				<p>
					Pentru exercitarea drepturilor sau orice întrebări legate de prelucrarea datelor personale,
					ne puteți contacta la:
				</p>
				<p>
					<strong>E-mail:</strong> office@cornaciu.ro<br />
					<strong>Telefon:</strong> +40 723 370 737<br />
					<strong>Adresă:</strong> Strada Trandafirilor nr. 3, Etaj 3, Giurgiu, România
				</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.legal-header {
		padding: 160px 0 60px;
		background: var(--light);
		border-bottom: 1px solid var(--border);
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 32px;
		font-size: 14px;
		color: var(--gray);
	}

	.breadcrumb a {
		color: var(--gray);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--secondary);
	}

	h1 {
		font-family: var(--font-serif);
		font-size: 48px;
		font-weight: 400;
		color: var(--primary);
		margin-bottom: 12px;
	}

	.updated {
		font-size: 14px;
		color: var(--gray);
	}

	.legal-body {
		padding: 80px 0 120px;
	}

	.content {
		max-width: 800px;
	}

	.content h2 {
		font-family: var(--font-serif);
		font-size: 28px;
		font-weight: 500;
		color: var(--primary);
		margin: 48px 0 16px;
	}

	.content h2:first-child {
		margin-top: 0;
	}

	.content p {
		font-size: 16px;
		line-height: 1.9;
		color: var(--gray);
		margin-bottom: 16px;
		font-weight: 300;
	}

	.content ul {
		margin: 16px 0 16px 24px;
	}

	.content li {
		font-size: 16px;
		line-height: 1.8;
		color: var(--gray);
		margin-bottom: 8px;
		font-weight: 300;
	}

	.content strong {
		color: var(--primary);
		font-weight: 600;
	}

	@media (max-width: 968px) {
		.legal-header {
			padding: 120px 0 40px;
		}

		h1 {
			font-size: 32px;
		}

		.legal-body {
			padding: 48px 0 80px;
		}

		.content h2 {
			font-size: 22px;
			margin: 32px 0 12px;
		}
	}
</style>
