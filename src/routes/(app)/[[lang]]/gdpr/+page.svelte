<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { createT, localePath } from '$lib/i18n';

	let { data } = $props();

	const locale = $derived(data.locale);
	const t = $derived(createT(locale));
</script>

<Seo
	{locale}
	title="{t('legal.gdprTitle')} | Cabinet Avocat Cornaciu"
	description={t('legal.gdprSeoDesc')}
	url="https://cornaciu.ro{localePath('/gdpr', locale)}"
/>

<section class="legal-header">
	<div class="container-narrow">
		<div class="breadcrumb">
			<a href={localePath('/', locale)}>{t('legal.breadcrumbHome')}</a>
			<span>/</span>
			<span>{t('legal.gdprTitle')}</span>
		</div>
		<h1>{t('legal.gdprTitle')}</h1>
		<p class="updated">{t('legal.lastUpdated')}</p>
	</div>
</section>

<section class="legal-body">
	<div class="container-narrow">
		<div class="content">
			{#if locale === 'en'}
				<h2>1. Our Commitment</h2>
				<p>
					Cornaciu Cătălin Law Office is fully committed to complying with Regulation (EU) 2016/679
					on the protection of natural persons with regard to the processing of personal data (GDPR)
					and applicable national legislation.
				</p>

				<h2>2. Data Controller</h2>
				<p>
					The data controller is Cornaciu Cătălin Law Office, headquartered at
					Strada Trandafirilor nr. 3, Floor 3, Giurgiu, Romania.
				</p>

				<h2>3. Processing Principles</h2>
				<p>We process your personal data in accordance with the following principles:</p>
				<ul>
					<li><strong>Lawfulness, fairness and transparency</strong> — processing is carried out lawfully, fairly and transparently</li>
					<li><strong>Purpose limitation</strong> — data is collected for specified, explicit and legitimate purposes</li>
					<li><strong>Data minimisation</strong> — we collect only the strictly necessary data</li>
					<li><strong>Accuracy</strong> — we take steps to update inaccurate data</li>
					<li><strong>Storage limitation</strong> — data is kept only for the necessary duration</li>
					<li><strong>Integrity and confidentiality</strong> — we ensure data security</li>
				</ul>

				<h2>4. Legal Basis for Processing</h2>
				<p>Data processing is based on one or more of the following legal grounds:</p>
				<ul>
					<li>Your explicit consent</li>
					<li>Necessity for the performance of a contract or pre-contractual measures</li>
					<li>Compliance with the controller's legal obligations</li>
					<li>Legitimate interest of the controller, respecting fundamental rights</li>
				</ul>

				<h2>5. Data Subject Rights</h2>
				<p>In accordance with GDPR, you have the following rights:</p>

				<h3>5.1. Right of Access</h3>
				<p>You have the right to obtain confirmation of data processing and a copy of your data.</p>

				<h3>5.2. Right to Rectification</h3>
				<p>You may request the correction of inaccurate data or completion of incomplete data.</p>

				<h3>5.3. Right to Erasure</h3>
				<p>You may request the deletion of personal data under certain conditions provided by GDPR.</p>

				<h3>5.4. Right to Restriction of Processing</h3>
				<p>You may request the restriction of processing in specific cases.</p>

				<h3>5.5. Right to Data Portability</h3>
				<p>You have the right to receive your data in a structured, commonly used and machine-readable format.</p>

				<h3>5.6. Right to Object</h3>
				<p>You may object to data processing based on the legitimate interest of the controller.</p>

				<h2>6. Filing a Complaint</h2>
				<p>
					If you believe that the processing of your personal data infringes on GDPR, you have
					the right to file a complaint with the National Supervisory Authority for Personal Data
					Processing (ANSPDCP):
				</p>
				<p>
					<strong>Address:</strong> B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, Bucharest<br />
					<strong>Phone:</strong> +40.318.059.211<br />
					<strong>E-mail:</strong> anspdcp@dataprotection.ro
				</p>

				<h2>7. Security Measures</h2>
				<p>
					We implement appropriate technical and organisational measures to protect personal data
					against unauthorised or unlawful processing, accidental loss, destruction or damage.
				</p>

				<h2>8. Data Protection Contact</h2>
				<p>
					For any request regarding personal data protection:
				</p>
				<p>
					<strong>E-mail:</strong> office@cornaciu.ro<br />
					<strong>Phone:</strong> +40 723 370 737<br />
					<strong>Address:</strong> Strada Trandafirilor nr. 3, Floor 3, Giurgiu, Romania
				</p>
			{:else if locale === 'bg'}
				<h2>1. Нашият ангажимент</h2>
				<p>
					Адвокатска кантора Корначу Кътълин се ангажира да спазва изцяло разпоредбите на
					Регламент (ЕС) 2016/679 относно защитата на физическите лица при обработката на
					лични данни (GDPR) и приложимото национално законодателство.
				</p>

				<h2>2. Администратор на данни</h2>
				<p>
					Администраторът на лични данни е Адвокатска кантора Корначу Кътълин, със
					седалище на ул. Трандафирилор № 3, Етаж 3, Джурджу, Румъния.
				</p>

				<h2>3. Принципи на обработка</h2>
				<p>Обработваме вашите лични данни при спазване на следните принципи:</p>
				<ul>
					<li><strong>Законосъобразност, справедливост и прозрачност</strong> — обработката се извършва законосъобразно, справедливо и прозрачно</li>
					<li><strong>Ограничение на целта</strong> — данните се събират за определени, изрични и законни цели</li>
					<li><strong>Свеждане на данните до минимум</strong> — събираме само строго необходимите данни</li>
					<li><strong>Точност</strong> — предприемаме мерки за актуализиране на неточните данни</li>
					<li><strong>Ограничение на съхранението</strong> — данните се съхраняват само за необходимия период</li>
					<li><strong>Цялостност и поверителност</strong> — осигуряваме сигурността на данните</li>
				</ul>

				<h2>4. Правно основание за обработка</h2>
				<p>Обработката на данни се основава на едно или повече от следните правни основания:</p>
				<ul>
					<li>Вашето изрично съгласие</li>
					<li>Необходимост за изпълнение на договор или преддоговорни мерки</li>
					<li>Спазване на законовите задължения на администратора</li>
					<li>Легитимен интерес на администратора, при зачитане на основните права</li>
				</ul>

				<h2>5. Права на субектите на данни</h2>
				<p>В съответствие с GDPR имате следните права:</p>

				<h3>5.1. Право на достъп</h3>
				<p>Имате право да получите потвърждение за обработката на данни и копие от тях.</p>

				<h3>5.2. Право на коригиране</h3>
				<p>Можете да поискате коригиране на неточни данни или допълване на непълни данни.</p>

				<h3>5.3. Право на изтриване</h3>
				<p>Можете да поискате изтриване на лични данни при определени условия, предвидени в GDPR.</p>

				<h3>5.4. Право на ограничаване на обработката</h3>
				<p>Можете да поискате ограничаване на обработката в конкретни случаи.</p>

				<h3>5.5. Право на преносимост на данните</h3>
				<p>Имате право да получите данните в структуриран, широко използван и пригоден за машинно четене формат.</p>

				<h3>5.6. Право на възражение</h3>
				<p>Можете да възразите срещу обработката на данни, основана на легитимния интерес на администратора.</p>

				<h2>6. Подаване на жалба</h2>
				<p>
					Ако считате, че обработката на вашите лични данни нарушава GDPR, имате право да
					подадете жалба до Националния надзорен орган за обработка на лични данни (ANSPDCP):
				</p>
				<p>
					<strong>Адрес:</strong> бул. Ген. Георге Магеру 28-30, Сектор 1, Букурещ<br />
					<strong>Телефон:</strong> +40.318.059.211<br />
					<strong>Имейл:</strong> anspdcp@dataprotection.ro
				</p>

				<h2>7. Мерки за сигурност</h2>
				<p>
					Прилагаме подходящи технически и организационни мерки за защита на личните данни
					срещу неразрешена или незаконна обработка, случайна загуба, унищожаване или повреда.
				</p>

				<h2>8. Контакт за защита на данните</h2>
				<p>
					За всякакви запитвания относно защитата на личните данни:
				</p>
				<p>
					<strong>Имейл:</strong> office@cornaciu.ro<br />
					<strong>Телефон:</strong> +40 723 370 737<br />
					<strong>Адрес:</strong> ул. Трандафирилор № 3, Етаж 3, Джурджу, Румъния
				</p>
			{:else}
				<h2>1. Angajamentul Nostru</h2>
				<p>
					Cabinet de Avocatură Cornaciu Cătălin se angajează să respecte pe deplin prevederile
					Regulamentului (UE) 2016/679 privind protecția persoanelor fizice în ceea ce privește
					prelucrarea datelor cu caracter personal (GDPR) și ale legislației naționale aplicabile.
				</p>

				<h2>2. Operator de Date</h2>
				<p>
					Operatorul de date cu caracter personal este Cabinet de Avocatură Cornaciu Cătălin,
					cu sediul în Strada Trandafirilor nr. 3, Etaj 3, Giurgiu, România.
				</p>

				<h2>3. Principiile Prelucrării</h2>
				<p>Prelucrăm datele dumneavoastră personale cu respectarea următoarelor principii:</p>
				<ul>
					<li><strong>Legalitate, echitate și transparență</strong> — prelucrarea se realizează în mod legal, echitabil și transparent</li>
					<li><strong>Limitarea scopului</strong> — datele sunt colectate în scopuri determinate, explicite și legitime</li>
					<li><strong>Reducerea datelor la minimum</strong> — colectăm doar datele strict necesare</li>
					<li><strong>Exactitate</strong> — luăm măsuri pentru actualizarea datelor inexacte</li>
					<li><strong>Limitarea stocării</strong> — datele sunt păstrate doar pe durata necesară</li>
					<li><strong>Integritate și confidențialitate</strong> — asigurăm securitatea datelor</li>
				</ul>

				<h2>4. Temeiul Legal al Prelucrării</h2>
				<p>Prelucrarea datelor se bazează pe unul sau mai multe dintre următoarele temeiuri legale:</p>
				<ul>
					<li>Consimțământul dumneavoastră explicit</li>
					<li>Necesitatea executării unui contract sau a unor măsuri precontractuale</li>
					<li>Respectarea obligațiilor legale ale operatorului</li>
					<li>Interesul legitim al operatorului, cu respectarea drepturilor fundamentale</li>
				</ul>

				<h2>5. Drepturile Persoanelor Vizate</h2>
				<p>În conformitate cu GDPR, aveți următoarele drepturi:</p>

				<h3>5.1. Dreptul de Acces</h3>
				<p>Aveți dreptul de a obține confirmarea prelucrării datelor și o copie a acestora.</p>

				<h3>5.2. Dreptul la Rectificare</h3>
				<p>Puteți solicita corectarea datelor inexacte sau completarea datelor incomplete.</p>

				<h3>5.3. Dreptul la Ștergere</h3>
				<p>Puteți solicita ștergerea datelor personale în anumite condiții prevăzute de GDPR.</p>

				<h3>5.4. Dreptul la Restricționarea Prelucrării</h3>
				<p>Puteți solicita restricționarea prelucrării în cazuri specifice.</p>

				<h3>5.5. Dreptul la Portabilitate</h3>
				<p>Aveți dreptul de a primi datele într-un format structurat, utilizat frecvent și care poate fi citit automat.</p>

				<h3>5.6. Dreptul la Opoziție</h3>
				<p>Puteți să vă opuneți prelucrării datelor bazate pe interesul legitim al operatorului.</p>

				<h2>6. Depunerea Unei Plângeri</h2>
				<p>
					Dacă considerați că prelucrarea datelor dumneavoastră personale încalcă GDPR, aveți
					dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării
					Datelor cu Caracter Personal (ANSPDCP):
				</p>
				<p>
					<strong>Adresă:</strong> B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București<br />
					<strong>Telefon:</strong> +40.318.059.211<br />
					<strong>E-mail:</strong> anspdcp@dataprotection.ro
				</p>

				<h2>7. Măsuri de Securitate</h2>
				<p>
					Implementăm măsuri tehnice și organizatorice adecvate pentru protecția datelor personale
					împotriva prelucrării neautorizate sau ilegale, a pierderii, distrugerii sau deteriorării
					accidentale.
				</p>

				<h2>8. Contact Protecția Datelor</h2>
				<p>
					Pentru orice solicitare privind protecția datelor personale:
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

	.content h3 {
		font-family: var(--font-serif);
		font-size: 22px;
		font-weight: 500;
		color: var(--primary);
		margin: 32px 0 12px;
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

		.content h3 {
			font-size: 18px;
		}
	}
</style>
