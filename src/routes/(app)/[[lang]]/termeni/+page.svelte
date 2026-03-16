<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { createT, localePath } from '$lib/i18n';

	let { data } = $props();

	const locale = $derived(data.locale);
	const t = $derived(createT(locale));
</script>

<Seo
	{locale}
	title="{t('legal.termsTitle')} | Cabinet Avocat Cornaciu"
	description={t('legal.termsSeoDesc')}
	url="https://cornaciu.ro{localePath('/termeni', locale)}"
/>

<section class="legal-header">
	<div class="container-narrow">
		<div class="breadcrumb">
			<a href={localePath('/', locale)}>{t('legal.breadcrumbHome')}</a>
			<span>/</span>
			<span>{t('legal.termsTitle')}</span>
		</div>
		<h1>{t('legal.termsTitle')}</h1>
		<p class="updated">{t('legal.lastUpdated')}</p>
	</div>
</section>

<section class="legal-body">
	<div class="container-narrow">
		<div class="content">
			{#if locale === 'en'}
				<h2>1. Acceptance of Terms</h2>
				<p>
					Accessing and using the cornaciu.ro website implies acceptance of these terms and conditions.
					If you do not agree with any of the provisions, please do not use the website.
				</p>

				<h2>2. General Information</h2>
				<p>
					The website is operated by Cornaciu Cătălin Law Office, with its professional headquarters at
					Strada Trandafirilor nr. 3, Floor 3, Giurgiu, Romania, member of the Giurgiu Bar Association.
				</p>

				<h2>3. Website Content</h2>
				<p>
					The information published on this website is of a general informational nature and does not
					constitute legal advice. The content of articles and published materials reflects professional
					opinions at the time of writing and does not replace the individual analysis of a specific case.
				</p>
				<p>
					To obtain legal advice tailored to your specific situation, we recommend scheduling
					a direct consultation.
				</p>

				<h2>4. Attorney-Client Relationship</h2>
				<p>
					Using the website or contacting the office through the means provided does not automatically
					create an attorney-client relationship. This relationship is established exclusively through
					the signing of a legal assistance contract.
				</p>

				<h2>5. Intellectual Property</h2>
				<p>
					All materials published on the website (texts, images, graphics, logos) are protected by
					copyright law. Reproduction, distribution or use without the written consent of the office
					is prohibited.
				</p>

				<h2>6. Limitation of Liability</h2>
				<p>
					The office does not guarantee the accuracy, completeness or timeliness of information
					published on the website. We do not assume responsibility for decisions made solely based
					on information from this website, without individualised legal advice.
				</p>

				<h2>7. External Links</h2>
				<p>
					The website may contain links to third-party websites. We do not assume responsibility
					for the content or privacy policies of these external websites.
				</p>

				<h2>8. Modification of Terms</h2>
				<p>
					We reserve the right to modify these terms at any time. Changes take effect on the date
					of publication on the website.
				</p>

				<h2>9. Applicable Law</h2>
				<p>
					These terms are governed by Romanian law. Any disputes shall be resolved by the
					competent courts in Romania.
				</p>

				<h2>10. Contact</h2>
				<p>
					For questions regarding these terms, you may contact us at:
				</p>
				<p>
					<strong>E-mail:</strong> office@cornaciu.ro<br />
					<strong>Phone:</strong> +40 723 370 737
				</p>
			{:else if locale === 'bg'}
				<h2>1. Приемане на условията</h2>
				<p>
					Достъпването и използването на уебсайта cornaciu.ro предполага приемане на тези общи условия.
					Ако не сте съгласни с някоя от разпоредбите, моля, не използвайте уебсайта.
				</p>

				<h2>2. Обща информация</h2>
				<p>
					Уебсайтът се управлява от Адвокатска кантора Корначу Кътълин, с професионално седалище на
					ул. Трандафирилор № 3, Етаж 3, Джурджу, Румъния, член на Адвокатска колегия Джурджу.
				</p>

				<h2>3. Съдържание на уебсайта</h2>
				<p>
					Информацията, публикувана на този уебсайт, е с общ информационен характер и не представлява
					правна консултация. Съдържанието на статиите и публикуваните материали отразява професионални
					мнения към момента на написването и не замества индивидуалния анализ на конкретен случай.
				</p>
				<p>
					За получаване на правна консултация, адаптирана към вашата конкретна ситуация, ви препоръчваме
					да насрочите директна консултация.
				</p>

				<h2>4. Отношения адвокат-клиент</h2>
				<p>
					Използването на уебсайта или свързването с кантората чрез предоставените средства не създава
					автоматично отношения адвокат-клиент. Тези отношения се установяват изключително чрез
					подписване на договор за правна помощ.
				</p>

				<h2>5. Интелектуална собственост</h2>
				<p>
					Всички материали, публикувани на уебсайта (текстове, изображения, графики, лого), са защитени
					от закона за авторското право. Възпроизвеждането, разпространяването или използването без
					писменото съгласие на кантората е забранено.
				</p>

				<h2>6. Ограничение на отговорността</h2>
				<p>
					Кантората не гарантира точността, пълнотата или актуалността на информацията, публикувана
					на уебсайта. Не поемаме отговорност за решения, взети единствено въз основа на информация
					от този уебсайт, без индивидуална правна консултация.
				</p>

				<h2>7. Външни връзки</h2>
				<p>
					Уебсайтът може да съдържа връзки към уебсайтове на трети страни. Не поемаме отговорност
					за съдържанието или политиките за поверителност на тези външни уебсайтове.
				</p>

				<h2>8. Промяна на условията</h2>
				<p>
					Запазваме си правото да променяме тези условия по всяко време. Промените влизат в сила
					от датата на публикуване на уебсайта.
				</p>

				<h2>9. Приложимо право</h2>
				<p>
					Тези условия се уреждат от румънското законодателство. Евентуалните спорове ще бъдат
					разрешавани от компетентните съдилища в Румъния.
				</p>

				<h2>10. Контакт</h2>
				<p>
					За въпроси относно тези условия можете да се свържете с нас на:
				</p>
				<p>
					<strong>Имейл:</strong> office@cornaciu.ro<br />
					<strong>Телефон:</strong> +40 723 370 737
				</p>
			{:else}
				<h2>1. Acceptarea Termenilor</h2>
				<p>
					Accesarea și utilizarea site-ului cornaciu.ro implică acceptarea acestor termeni și condiții.
					Dacă nu sunteți de acord cu oricare dintre prevederi, vă rugăm să nu utilizați site-ul.
				</p>

				<h2>2. Informații Generale</h2>
				<p>
					Site-ul este operat de Cabinet de Avocatură Cornaciu Cătălin, cu sediul profesional în
					Strada Trandafirilor nr. 3, Etaj 3, Giurgiu, România, membru al Baroului Giurgiu.
				</p>

				<h2>3. Conținutul Site-ului</h2>
				<p>
					Informațiile publicate pe acest site au caracter general informativ și nu constituie
					consultanță juridică. Conținutul articolelor și materialelor publicate reflectă opinii
					profesionale la momentul redactării și nu înlocuiesc analiza individuală a unui caz concret.
				</p>
				<p>
					Pentru obținerea de consultanță juridică adaptată situației dumneavoastră specifice, vă
					recomandăm programarea unei consultații directe.
				</p>

				<h2>4. Relația Avocat-Client</h2>
				<p>
					Utilizarea site-ului sau contactarea cabinetului prin mijloacele puse la dispoziție nu
					creează automat o relație avocat-client. Această relație se naște exclusiv prin semnarea
					unui contract de asistență juridică.
				</p>

				<h2>5. Proprietate Intelectuală</h2>
				<p>
					Toate materialele publicate pe site (texte, imagini, grafice, logo) sunt protejate de
					legea drepturilor de autor. Reproducerea, distribuirea sau utilizarea acestora fără
					acordul scris al cabinetului este interzisă.
				</p>

				<h2>6. Limitarea Răspunderii</h2>
				<p>
					Cabinetul nu garantează exactitatea, completitudinea sau actualitatea informațiilor
					publicate pe site. Nu ne asumăm responsabilitatea pentru decizii luate exclusiv pe baza
					informațiilor de pe acest site, fără o consultanță juridică individualizată.
				</p>

				<h2>7. Legături Externe</h2>
				<p>
					Site-ul poate conține legături către site-uri terțe. Nu ne asumăm responsabilitatea
					pentru conținutul sau politicile de confidențialitate ale acestor site-uri externe.
				</p>

				<h2>8. Modificarea Termenilor</h2>
				<p>
					Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările intră
					în vigoare la data publicării pe site.
				</p>

				<h2>9. Legea Aplicabilă</h2>
				<p>
					Acești termeni sunt guvernați de legislația română. Eventualele litigii vor fi
					soluționate de instanțele competente din România.
				</p>

				<h2>10. Contact</h2>
				<p>
					Pentru întrebări referitoare la acești termeni, ne puteți contacta la:
				</p>
				<p>
					<strong>E-mail:</strong> office@cornaciu.ro<br />
					<strong>Telefon:</strong> +40 723 370 737
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

	.content :global(ul) {
		margin: 16px 0 16px 24px;
	}

	.content :global(li) {
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
