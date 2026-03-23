// Seed legal pages with markdown content from the existing hardcoded HTML
// Run: node --loader=tsx scripts/seed-legal.mjs
// Or:  cd cornaciu.ro && node scripts/seed-legal.mjs

import postgres from 'postgres';

const PAGES = {
	confidentialitate: {
		ro: `## 1. Informații Generale

Cabinet de Avocatură Cornaciu Cătălin, cu sediul în Strada Trandafirilor nr. 3, Etaj 3, Giurgiu, România, respectă confidențialitatea vizitatorilor site-ului cornaciu.ro și se angajează să protejeze datele personale colectate.

## 2. Date Colectate

Putem colecta următoarele categorii de date personale:

- Date de identificare: nume, prenume, adresă de e-mail, număr de telefon
- Date de navigare: adresă IP, tipul browserului, paginile vizitate, durata vizitei
- Date transmise prin formulare de contact sau e-mail

## 3. Scopul Prelucrării

Datele personale sunt prelucrate în următoarele scopuri:

- Răspuns la solicitările de informații și programare consultații
- Furnizarea serviciilor juridice solicitate
- Respectarea obligațiilor legale
- Îmbunătățirea funcționalității site-ului

## 4. Temeiul Juridic

Prelucrarea datelor se bazează pe: consimțământul dumneavoastră, executarea unui contract sau a unor demersuri precontractuale, respectarea obligațiilor legale sau interesul legitim al cabinetului.

## 5. Durata Stocării

Datele personale sunt stocate pentru perioada necesară îndeplinirii scopurilor menționate, cu respectarea termenelor impuse de legislația în vigoare. Datele asociate reprezentării juridice sunt păstrate conform cerințelor legale privind arhivarea.

## 6. Drepturile Dumneavoastră

Conform Regulamentului General privind Protecția Datelor (GDPR), aveți dreptul la:

- Accesul la datele personale
- Rectificarea datelor inexacte
- Ștergerea datelor (dreptul de a fi uitat)
- Restricționarea prelucrării
- Portabilitatea datelor
- Opoziție la prelucrare
- Retragerea consimțământului

## 7. Servicii Terțe

Site-ul utilizează Google Fonts pentru afișarea fonturilor și Google Maps pentru harta locației. Aceste servicii pot colecta date conform propriilor politici de confidențialitate.

## 8. Contact

Pentru exercitarea drepturilor sau orice întrebări legate de prelucrarea datelor personale, ne puteți contacta la:

**E-mail:** office@cornaciu.ro
**Telefon:** +40 723 370 737
**Adresă:** Strada Trandafirilor nr. 3, Etaj 3, Giurgiu, România`,

		en: `## 1. General Information

Cornaciu Cătălin Law Office, headquartered at Strada Trandafirilor nr. 3, Floor 3, Giurgiu, Romania, respects the privacy of visitors to the cornaciu.ro website and is committed to protecting the personal data collected.

## 2. Data Collected

We may collect the following categories of personal data:

- Identification data: name, surname, e-mail address, phone number
- Browsing data: IP address, browser type, pages visited, visit duration
- Data submitted via contact forms or e-mail

## 3. Purpose of Processing

Personal data is processed for the following purposes:

- Responding to information requests and scheduling consultations
- Providing requested legal services
- Compliance with legal obligations
- Improving website functionality

## 4. Legal Basis

Data processing is based on: your consent, the performance of a contract or pre-contractual steps, compliance with legal obligations, or the legitimate interest of the office.

## 5. Data Retention

Personal data is stored for the period necessary to fulfil the stated purposes, in compliance with the periods imposed by applicable legislation. Data associated with legal representation is retained in accordance with legal archiving requirements.

## 6. Your Rights

Under the General Data Protection Regulation (GDPR), you have the right to:

- Access your personal data
- Rectification of inaccurate data
- Erasure of data (right to be forgotten)
- Restriction of processing
- Data portability
- Object to processing
- Withdraw consent

## 7. Third-Party Services

The website uses Google Fonts for font display and Google Maps for the location map. These services may collect data in accordance with their own privacy policies.

## 8. Contact

To exercise your rights or for any questions regarding personal data processing, you may contact us at:

**E-mail:** office@cornaciu.ro
**Phone:** +40 723 370 737
**Address:** Strada Trandafirilor nr. 3, Floor 3, Giurgiu, Romania`,

		bg: `## 1. Обща информация

Адвокатска кантора Корначу Кътълин, със седалище на ул. Трандафирилор № 3, Етаж 3, Джурджу, Румъния, зачита поверителността на посетителите на уебсайта cornaciu.ro и се ангажира да защитава събраните лични данни.

## 2. Събирани данни

Можем да събираме следните категории лични данни:

- Идентификационни данни: име, фамилия, имейл адрес, телефонен номер
- Данни за навигация: IP адрес, тип браузър, посетени страници, продължителност на посещението
- Данни, предадени чрез формуляри за контакт или имейл

## 3. Цел на обработката

Личните данни се обработват за следните цели:

- Отговор на запитвания за информация и насрочване на консултации
- Предоставяне на поискани правни услуги
- Спазване на законовите задължения
- Подобряване на функционалността на уебсайта

## 4. Правно основание

Обработката на данни се основава на: вашето съгласие, изпълнение на договор или преддоговорни стъпки, спазване на законовите задължения или легитимния интерес на кантората.

## 5. Срок на съхранение

Личните данни се съхраняват за периода, необходим за изпълнение на посочените цели, при спазване на сроковете, наложени от действащото законодателство. Данните, свързани с правно представителство, се съхраняват съгласно законовите изисквания за архивиране.

## 6. Вашите права

Съгласно Общия регламент за защита на данните (GDPR), имате право на:

- Достъп до личните данни
- Коригиране на неточни данни
- Изтриване на данни (право да бъдеш забравен)
- Ограничаване на обработката
- Преносимост на данните
- Възражение срещу обработката
- Оттегляне на съгласието

## 7. Услуги на трети страни

Уебсайтът използва Google Fonts за показване на шрифтове и Google Maps за картата на местоположението. Тези услуги могат да събират данни съгласно собствените си политики за поверителност.

## 8. Контакт

За упражняване на вашите права или за въпроси относно обработката на лични данни можете да се свържете с нас на:

**Имейл:** office@cornaciu.ro
**Телефон:** +40 723 370 737
**Адрес:** ул. Трандафирилор № 3, Етаж 3, Джурджу, Румъния`
	},

	gdpr: {
		ro: `## 1. Angajamentul Nostru

Cabinet de Avocatură Cornaciu Cătălin se angajează să respecte pe deplin prevederile Regulamentului (UE) 2016/679 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal (GDPR) și ale legislației naționale aplicabile.

## 2. Operator de Date

Operatorul de date cu caracter personal este Cabinet de Avocatură Cornaciu Cătălin, cu sediul în Strada Trandafirilor nr. 3, Etaj 3, Giurgiu, România.

## 3. Principiile Prelucrării

Prelucrăm datele dumneavoastră personale cu respectarea următoarelor principii:

- **Legalitate, echitate și transparență** — prelucrarea se realizează în mod legal, echitabil și transparent
- **Limitarea scopului** — datele sunt colectate în scopuri determinate, explicite și legitime
- **Reducerea datelor la minimum** — colectăm doar datele strict necesare
- **Exactitate** — luăm măsuri pentru actualizarea datelor inexacte
- **Limitarea stocării** — datele sunt păstrate doar pe durata necesară
- **Integritate și confidențialitate** — asigurăm securitatea datelor

## 4. Temeiul Legal al Prelucrării

Prelucrarea datelor se bazează pe unul sau mai multe dintre următoarele temeiuri legale:

- Consimțământul dumneavoastră explicit
- Necesitatea executării unui contract sau a unor măsuri precontractuale
- Respectarea obligațiilor legale ale operatorului
- Interesul legitim al operatorului, cu respectarea drepturilor fundamentale

## 5. Drepturile Persoanelor Vizate

În conformitate cu GDPR, aveți următoarele drepturi:

### 5.1. Dreptul de Acces

Aveți dreptul de a obține confirmarea prelucrării datelor și o copie a acestora.

### 5.2. Dreptul la Rectificare

Puteți solicita corectarea datelor inexacte sau completarea datelor incomplete.

### 5.3. Dreptul la Ștergere

Puteți solicita ștergerea datelor personale în anumite condiții prevăzute de GDPR.

### 5.4. Dreptul la Restricționarea Prelucrării

Puteți solicita restricționarea prelucrării în cazuri specifice.

### 5.5. Dreptul la Portabilitate

Aveți dreptul de a primi datele într-un format structurat, utilizat frecvent și care poate fi citit automat.

### 5.6. Dreptul la Opoziție

Puteți să vă opuneți prelucrării datelor bazate pe interesul legitim al operatorului.

## 6. Depunerea Unei Plângeri

Dacă considerați că prelucrarea datelor dumneavoastră personale încalcă GDPR, aveți dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP):

**Adresă:** B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București
**Telefon:** +40.318.059.211
**E-mail:** anspdcp@dataprotection.ro

## 7. Măsuri de Securitate

Implementăm măsuri tehnice și organizatorice adecvate pentru protecția datelor personale împotriva prelucrării neautorizate sau ilegale, a pierderii, distrugerii sau deteriorării accidentale.

## 8. Contact Protecția Datelor

Pentru orice solicitare privind protecția datelor personale:

**E-mail:** office@cornaciu.ro
**Telefon:** +40 723 370 737
**Adresă:** Strada Trandafirilor nr. 3, Etaj 3, Giurgiu, România`,

		en: `## 1. Our Commitment

Cornaciu Cătălin Law Office is fully committed to complying with Regulation (EU) 2016/679 on the protection of natural persons with regard to the processing of personal data (GDPR) and applicable national legislation.

## 2. Data Controller

The data controller is Cornaciu Cătălin Law Office, headquartered at Strada Trandafirilor nr. 3, Floor 3, Giurgiu, Romania.

## 3. Processing Principles

We process your personal data in accordance with the following principles:

- **Lawfulness, fairness and transparency** — processing is carried out lawfully, fairly and transparently
- **Purpose limitation** — data is collected for specified, explicit and legitimate purposes
- **Data minimisation** — we collect only the strictly necessary data
- **Accuracy** — we take steps to update inaccurate data
- **Storage limitation** — data is kept only for the necessary duration
- **Integrity and confidentiality** — we ensure data security

## 4. Legal Basis for Processing

Data processing is based on one or more of the following legal grounds:

- Your explicit consent
- Necessity for the performance of a contract or pre-contractual measures
- Compliance with the controller's legal obligations
- Legitimate interest of the controller, respecting fundamental rights

## 5. Data Subject Rights

In accordance with GDPR, you have the following rights:

### 5.1. Right of Access

You have the right to obtain confirmation of data processing and a copy of your data.

### 5.2. Right to Rectification

You may request the correction of inaccurate data or completion of incomplete data.

### 5.3. Right to Erasure

You may request the deletion of personal data under certain conditions provided by GDPR.

### 5.4. Right to Restriction of Processing

You may request the restriction of processing in specific cases.

### 5.5. Right to Data Portability

You have the right to receive your data in a structured, commonly used and machine-readable format.

### 5.6. Right to Object

You may object to data processing based on the legitimate interest of the controller.

## 6. Filing a Complaint

If you believe that the processing of your personal data infringes on GDPR, you have the right to file a complaint with the National Supervisory Authority for Personal Data Processing (ANSPDCP):

**Address:** B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, Bucharest
**Phone:** +40.318.059.211
**E-mail:** anspdcp@dataprotection.ro

## 7. Security Measures

We implement appropriate technical and organisational measures to protect personal data against unauthorised or unlawful processing, accidental loss, destruction or damage.

## 8. Data Protection Contact

For any request regarding personal data protection:

**E-mail:** office@cornaciu.ro
**Phone:** +40 723 370 737
**Address:** Strada Trandafirilor nr. 3, Floor 3, Giurgiu, Romania`,

		bg: `## 1. Нашият ангажимент

Адвокатска кантора Корначу Кътълин се ангажира да спазва изцяло разпоредбите на Регламент (ЕС) 2016/679 относно защитата на физическите лица при обработката на лични данни (GDPR) и приложимото национално законодателство.

## 2. Администратор на данни

Администраторът на лични данни е Адвокатска кантора Корначу Кътълин, със седалище на ул. Трандафирилор № 3, Етаж 3, Джурджу, Румъния.

## 3. Принципи на обработка

Обработваме вашите лични данни при спазване на следните принципи:

- **Законосъобразност, справедливост и прозрачност** — обработката се извършва законосъобразно, справедливо и прозрачно
- **Ограничение на целта** — данните се събират за определени, изрични и законни цели
- **Свеждане на данните до минимум** — събираме само строго необходимите данни
- **Точност** — предприемаме мерки за актуализиране на неточните данни
- **Ограничение на съхранението** — данните се съхраняват само за необходимия период
- **Цялостност и поверителност** — осигуряваме сигурността на данните

## 4. Правно основание за обработка

Обработката на данни се основава на едно или повече от следните правни основания:

- Вашето изрично съгласие
- Необходимост за изпълнение на договор или преддоговорни мерки
- Спазване на законовите задължения на администратора
- Легитимен интерес на администратора, при зачитане на основните права

## 5. Права на субектите на данни

В съответствие с GDPR имате следните права:

### 5.1. Право на достъп

Имате право да получите потвърждение за обработката на данни и копие от тях.

### 5.2. Право на коригиране

Можете да поискате коригиране на неточни данни или допълване на непълни данни.

### 5.3. Право на изтриване

Можете да поискате изтриване на лични данни при определени условия, предвидени в GDPR.

### 5.4. Право на ограничаване на обработката

Можете да поискате ограничаване на обработката в конкретни случаи.

### 5.5. Право на преносимост на данните

Имате право да получите данните в структуриран, широко използван и пригоден за машинно четене формат.

### 5.6. Право на възражение

Можете да възразите срещу обработката на данни, основана на легитимния интерес на администратора.

## 6. Подаване на жалба

Ако считате, че обработката на вашите лични данни нарушава GDPR, имате право да подадете жалба до Националния надзорен орган за обработка на лични данни (ANSPDCP):

**Адрес:** бул. Ген. Георге Магеру 28-30, Сектор 1, Букурещ
**Телефон:** +40.318.059.211
**Имейл:** anspdcp@dataprotection.ro

## 7. Мерки за сигурност

Прилагаме подходящи технически и организационни мерки за защита на личните данни срещу неразрешена или незаконна обработка, случайна загуба, унищожаване или повреда.

## 8. Контакт за защита на данните

За всякакви запитвания относно защитата на личните данни:

**Имейл:** office@cornaciu.ro
**Телефон:** +40 723 370 737
**Адрес:** ул. Трандафирилор № 3, Етаж 3, Джурджу, Румъния`
	},

	termeni: {
		ro: `## 1. Acceptarea Termenilor

Accesarea și utilizarea site-ului cornaciu.ro implică acceptarea acestor termeni și condiții. Dacă nu sunteți de acord cu oricare dintre prevederi, vă rugăm să nu utilizați site-ul.

## 2. Informații Generale

Site-ul este operat de Cabinet de Avocatură Cornaciu Cătălin, cu sediul profesional în Strada Trandafirilor nr. 3, Etaj 3, Giurgiu, România, membru al Baroului Giurgiu.

## 3. Conținutul Site-ului

Informațiile publicate pe acest site au caracter general informativ și nu constituie consultanță juridică. Conținutul articolelor și materialelor publicate reflectă opinii profesionale la momentul redactării și nu înlocuiesc analiza individuală a unui caz concret.

Pentru obținerea de consultanță juridică adaptată situației dumneavoastră specifice, vă recomandăm programarea unei consultații directe.

## 4. Relația Avocat-Client

Utilizarea site-ului sau contactarea cabinetului prin mijloacele puse la dispoziție nu creează automat o relație avocat-client. Această relație se naște exclusiv prin semnarea unui contract de asistență juridică.

## 5. Proprietate Intelectuală

Toate materialele publicate pe site (texte, imagini, grafice, logo) sunt protejate de legea drepturilor de autor. Reproducerea, distribuirea sau utilizarea acestora fără acordul scris al cabinetului este interzisă.

## 6. Limitarea Răspunderii

Cabinetul nu garantează exactitatea, completitudinea sau actualitatea informațiilor publicate pe site. Nu ne asumăm responsabilitatea pentru decizii luate exclusiv pe baza informațiilor de pe acest site, fără o consultanță juridică individualizată.

## 7. Legături Externe

Site-ul poate conține legături către site-uri terțe. Nu ne asumăm responsabilitatea pentru conținutul sau politicile de confidențialitate ale acestor site-uri externe.

## 8. Modificarea Termenilor

Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările intră în vigoare la data publicării pe site.

## 9. Legea Aplicabilă

Acești termeni sunt guvernați de legislația română. Eventualele litigii vor fi soluționate de instanțele competente din România.

## 10. Contact

Pentru întrebări referitoare la acești termeni, ne puteți contacta la:

**E-mail:** office@cornaciu.ro
**Telefon:** +40 723 370 737`,

		en: `## 1. Acceptance of Terms

Accessing and using the cornaciu.ro website implies acceptance of these terms and conditions. If you do not agree with any of the provisions, please do not use the website.

## 2. General Information

The website is operated by Cornaciu Cătălin Law Office, with its professional headquarters at Strada Trandafirilor nr. 3, Floor 3, Giurgiu, Romania, member of the Giurgiu Bar Association.

## 3. Website Content

The information published on this website is of a general informational nature and does not constitute legal advice. The content of articles and published materials reflects professional opinions at the time of writing and does not replace the individual analysis of a specific case.

To obtain legal advice tailored to your specific situation, we recommend scheduling a direct consultation.

## 4. Attorney-Client Relationship

Using the website or contacting the office through the means provided does not automatically create an attorney-client relationship. This relationship is established exclusively through the signing of a legal assistance contract.

## 5. Intellectual Property

All materials published on the website (texts, images, graphics, logos) are protected by copyright law. Reproduction, distribution or use without the written consent of the office is prohibited.

## 6. Limitation of Liability

The office does not guarantee the accuracy, completeness or timeliness of information published on the website. We do not assume responsibility for decisions made solely based on information from this website, without individualised legal advice.

## 7. External Links

The website may contain links to third-party websites. We do not assume responsibility for the content or privacy policies of these external websites.

## 8. Modification of Terms

We reserve the right to modify these terms at any time. Changes take effect on the date of publication on the website.

## 9. Applicable Law

These terms are governed by Romanian law. Any disputes shall be resolved by the competent courts in Romania.

## 10. Contact

For questions regarding these terms, you may contact us at:

**E-mail:** office@cornaciu.ro
**Phone:** +40 723 370 737`,

		bg: `## 1. Приемане на условията

Достъпването и използването на уебсайта cornaciu.ro предполага приемане на тези общи условия. Ако не сте съгласни с някоя от разпоредбите, моля, не използвайте уебсайта.

## 2. Обща информация

Уебсайтът се управлява от Адвокатска кантора Корначу Кътълин, с професионално седалище на ул. Трандафирилор № 3, Етаж 3, Джурджу, Румъния, член на Адвокатска колегия Джурджу.

## 3. Съдържание на уебсайта

Информацията, публикувана на този уебсайт, е с общ информационен характер и не представлява правна консултация. Съдържанието на статиите и публикуваните материали отразява професионални мнения към момента на написването и не замества индивидуалния анализ на конкретен случай.

За получаване на правна консултация, адаптирана към вашата конкретна ситуация, ви препоръчваме да насрочите директна консултация.

## 4. Отношения адвокат-клиент

Използването на уебсайта или свързването с кантората чрез предоставените средства не създава автоматично отношения адвокат-клиент. Тези отношения се установяват изключително чрез подписване на договор за правна помощ.

## 5. Интелектуална собственост

Всички материали, публикувани на уебсайта (текстове, изображения, графики, лого), са защитени от закона за авторското право. Възпроизвеждането, разпространяването или използването без писменото съгласие на кантората е забранено.

## 6. Ограничение на отговорността

Кантората не гарантира точността, пълнотата или актуалността на информацията, публикувана на уебсайта. Не поемаме отговорност за решения, взети единствено въз основа на информация от този уебсайт, без индивидуална правна консултация.

## 7. Външни връзки

Уебсайтът може да съдържа връзки към уебсайтове на трети страни. Не поемаме отговорност за съдържанието или политиките за поверителност на тези външни уебсайтове.

## 8. Промяна на условията

Запазваме си правото да променяме тези условия по всяко време. Промените влизат в сила от датата на публикуване на уебсайта.

## 9. Приложимо право

Тези условия се уреждат от румънското законодателство. Евентуалните спорове ще бъдат разрешавани от компетентните съдилища в Румъния.

## 10. Контакт

За въпроси относно тези условия можете да се свържете с нас на:

**Имейл:** office@cornaciu.ro
**Телефон:** +40 723 370 737`
	}
};

async function seed() {
	const sql = postgres('postgres://root:mysecretpassword@localhost:5433/local');

	for (const [slug, locales] of Object.entries(PAGES)) {
		for (const [locale, content] of Object.entries(locales)) {
			const existing = await sql`SELECT id FROM legal_page WHERE slug = ${slug} AND locale = ${locale}`;
			if (existing.length > 0) {
				await sql`UPDATE legal_page SET content = ${content}, updated_at = NOW() WHERE slug = ${slug} AND locale = ${locale}`;
				console.log(`Updated ${slug}/${locale}`);
			} else {
				await sql`INSERT INTO legal_page (slug, locale, content) VALUES (${slug}, ${locale}, ${content})`;
				console.log(`Inserted ${slug}/${locale}`);
			}
		}
	}

	console.log('Done! 9 legal pages seeded.');
	await sql.end();
}

seed().catch(console.error);
