<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let saving = $state(false);
	let translating = $state(false);
	let expandedSections = $state<Record<string, boolean>>({});
	let historyOpen = $state<string | null>(null);
	let historyEntries = $state<{ id: number; value: string; changeType: string; changedAt: string | null }[]>([]);
	let historyLoading = $state(false);

	// Dirty tracking for unsaved changes
	let dirtyFields = $state(new Set<string>());
	let isDirty = $state(false);

	$effect(() => {
		const handler = (e: BeforeUnloadEvent) => {
			if (isDirty) { e.preventDefault(); }
		};
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	});

	function markDirty(key?: string) {
		isDirty = true;
		if (key) dirtyFields = new Set([...dirtyFields, key]);
	}

	// Expertise reorder state
	let expertiseOrder = $state<string[]>([]);
	let expertiseDragIdx = $state<number | null>(null);
	$effect(() => { expertiseOrder = [...data.expertiseOrder]; });

	// Contact entries state
	let contactEntries = $state<Array<{ type: string; label: string; value: string; linkPrefix?: string }>>([]);
	let contactDragIdx = $state<number | null>(null);
	$effect(() => { contactEntries = data.contactEntries.map(e => ({ ...e })); });

	// Combined about text states
	let aboutText = $state('');
	let aboutPageBioText = $state('');
	let aboutPagePhiloText = $state('');

	function getFieldVal(sectionFields: typeof data.sections[string], key: string): string {
		const f = sectionFields?.find((fi: { key: string }) => fi.key === key);
		return f ? (f.override ?? f.defaultValue) : '';
	}

	$effect(() => {
		const s = data.sections['about'];
		if (s) aboutText = ['about.p1', 'about.p2', 'about.p3'].map(k => getFieldVal(s, k)).filter(Boolean).join('\n\n');
	});
	$effect(() => {
		const s = data.sections['aboutPage'];
		if (s) {
			aboutPageBioText = ['aboutPage.bio1', 'aboutPage.bio2', 'aboutPage.bio3'].map(k => getFieldVal(s, k)).filter(Boolean).join('\n\n');
			aboutPagePhiloText = ['aboutPage.philosophy1', 'aboutPage.philosophy2'].map(k => getFieldVal(s, k)).filter(Boolean).join('\n\n');
		}
	});

	function splitParagraphs(text: string, count: number): string[] {
		const parts = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
		const result: string[] = [];
		for (let i = 0; i < count; i++) {
			if (i < count - 1) result.push(parts[i] ?? '');
			else result.push(parts.slice(i).join('\n\n'));
		}
		return result;
	}

	const aboutParts = $derived(splitParagraphs(aboutText, 3));
	const bioParts = $derived(splitParagraphs(aboutPageBioText, 3));
	const philoParts = $derived(splitParagraphs(aboutPagePhiloText, 2));

	const expertiseKeyLabels: Record<string, string> = {
		civil: 'Drept Civil',
		commercial: 'Drept Comercial',
		family: 'Dreptul Familiei',
		realestate: 'Drept Imobiliar',
		labor: 'Dreptul Muncii',
		criminal: 'Drept Penal'
	};

	const changeTypeLabels: Record<string, string> = {
		edit: 'Editare manuală',
		delete: 'Resetare',
		translate: 'Traducere AI',
		restore: 'Restaurare'
	};

	const contactTypes = [
		{ value: 'address', label: 'Adresă', linkPrefix: '' },
		{ value: 'phone', label: 'Telefon', linkPrefix: 'tel:' },
		{ value: 'email', label: 'Email', linkPrefix: 'mailto:' },
		{ value: 'custom', label: 'Personalizat', linkPrefix: '' }
	];

	const sectionIcons: Record<string, string> = {
		hero: '🏠', expertise: '⚖️', results: '📊', about: '👤',
		testimonials: '💬', approach: '📋', articleCards: '📰', contact: '📞',
		nav: '🧭', footer: '🦶', cookie: '🍪', seo: '🔍', legal: '⚖️', skipLink: '♿',
		articles: '📰', articleDetail: '📄', aboutPage: '👤'
	};

	const statPairs = [
		{ titleKey: 'results.years', valueKey: 'results.yearsValue' },
		{ titleKey: 'results.cases', valueKey: 'results.casesValue' },
		{ titleKey: 'results.rate', valueKey: 'results.rateValue' },
		{ titleKey: 'results.recovered', valueKey: 'results.recoveredValue' }
	];

	function navUrl(pageId: string): string {
		const params = new URLSearchParams();
		params.set('pagina', pageId);
		if (data.locale !== 'ro') params.set('limba', data.locale);
		return `/admin/continut?${params.toString()}`;
	}

	function toggleSection(section: string) {
		expandedSections[section] = !expandedSections[section];
	}

	function switchLocale(e: Event) {
		const select = e.target as HTMLSelectElement;
		historyOpen = null;
		goto(`/admin/continut?pagina=${data.activePage}&limba=${select.value}`);
	}

	function countOverrides(section: string): number {
		return data.sections[section]?.filter((f) => f.override !== null).length ?? 0;
	}

	async function resetField(key: string) {
		const fd = new FormData();
		fd.set('key', key);
		fd.set('locale', data.locale);
		await fetch('?/reset', { method: 'POST', body: fd });
		goto(`/admin/continut?pagina=${data.activePage}&limba=${data.locale}`, { invalidateAll: true });
	}

	async function translateAll() {
		translating = true;
		try {
			const fd = new FormData();
			fd.set('locale', data.locale);
			await fetch('?/translate', { method: 'POST', body: fd });
			await invalidateAll();
			goto(`/admin/continut?pagina=${data.activePage}&limba=${data.locale}`, { invalidateAll: true });
		} finally {
			translating = false;
		}
	}

	async function toggleHistory(key: string) {
		if (historyOpen === key) { historyOpen = null; return; }
		historyLoading = true;
		historyOpen = key;
		historyEntries = [];
		try {
			const fd = new FormData();
			fd.set('key', key);
			fd.set('locale', data.locale);
			const res = await fetch('?/history', { method: 'POST', body: fd });
			const html = await res.text();
			const match = html.match(/data-sveltekit-form-result="([^"]+)"/);
			if (match) {
				const decoded = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
				const parsed = JSON.parse(decoded);
				if (parsed.data?.historyEntries) historyEntries = parsed.data.historyEntries;
			}
		} catch { historyEntries = []; }
		finally { historyLoading = false; }
	}

	async function restoreVersion(historyId: number) {
		const fd = new FormData();
		fd.set('historyId', String(historyId));
		fd.set('locale', data.locale);
		await fetch('?/restore', { method: 'POST', body: fd });
		historyOpen = null;
		goto(`/admin/continut?pagina=${data.activePage}&limba=${data.locale}`, { invalidateAll: true });
	}

	// Generic drag handlers
	function makeDragHandlers<T>(getList: () => T[], setList: (v: T[]) => void, getDragIdx: () => number | null, setDragIdx: (v: number | null) => void) {
		return {
			start(i: number) { setDragIdx(i); },
			over(e: DragEvent, i: number) {
				e.preventDefault();
				const di = getDragIdx();
				if (di === null || di === i) return;
				const arr = [...getList()];
				const [moved] = arr.splice(di, 1);
				arr.splice(i, 0, moved);
				setList(arr);
				setDragIdx(i);
			},
			end() { setDragIdx(null); }
		};
	}

	const expDrag = makeDragHandlers(
		() => expertiseOrder, v => { expertiseOrder = v; markDirty(); },
		() => expertiseDragIdx, v => expertiseDragIdx = v
	);
	const contactDrag = makeDragHandlers(
		() => contactEntries, v => { contactEntries = v; markDirty(); },
		() => contactDragIdx, v => contactDragIdx = v
	);

	function addContactEntry() {
		contactEntries = [...contactEntries, { type: 'custom', label: '', value: '', linkPrefix: '' }];
		markDirty();
	}
	function removeContactEntry(i: number) {
		contactEntries = contactEntries.filter((_, idx) => idx !== i);
		markDirty();
	}
	function updateContactType(i: number, type: string) {
		const ct = contactTypes.find(t => t.value === type);
		contactEntries[i].type = type;
		if (ct) contactEntries[i].linkPrefix = ct.linkPrefix;
		markDirty();
	}

	function formatDate(iso: string | null): string {
		if (!iso) return '—';
		return new Date(iso).toLocaleString('ro-RO', {
			day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
		});
	}
</script>

<div class="content-page">
	<!-- Page header -->
	<div class="page-header">
		<div>
			<h1>Conținut Site</h1>
			<p class="subtitle">Editează conținutul paginilor site-ului.</p>
		</div>
		<div class="locale-picker">
			<label for="locale-select">Limbă:</label>
			<select id="locale-select" onchange={switchLocale} value={data.locale}>
				{#each data.locales as loc}
					<option value={loc}>{loc.toUpperCase()}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Page tabs -->
	<nav class="page-tabs">
		{#each data.pages as page}
			<a
				href={navUrl(page.id)}
				class="page-tab"
				class:active={data.activePage === page.id}
			>{page.label}</a>
		{/each}
	</nav>

	<!-- Toasts -->
	{#if form?.restored}
		<div class="toast success">Versiunea anterioară a fost restaurată.</div>
	{/if}
	{#if form?.success}
		<div class="toast success">Modificările au fost salvate.</div>
	{/if}
	{#if form?.translated !== undefined}
		<div class="toast success">✓ {form.translated} câmpuri traduse automat.</div>
	{/if}
	{#if form?.message}
		<div class="toast error">{form.message}</div>
	{/if}

	<!-- Translation bar -->
	{#if data.locale !== 'ro'}
		<div class="translate-bar">
			<div class="translate-info">
				<span class="translate-icon">🌐</span>
				{#if data.pendingTranslations > 0}
					<span><strong>{data.pendingTranslations}</strong> câmpuri necesită traducere din română.</span>
				{:else}
					<span>Toate câmpurile sunt traduse la zi.</span>
				{/if}
			</div>
			<button
				type="button"
				class="translate-btn"
				disabled={translating || data.pendingTranslations === 0}
				onclick={translateAll}
			>
				{translating ? 'Se traduce...' : `Traducere AI (${data.pendingTranslations})`}
			</button>
		</div>
	{/if}

	<!-- Main form -->
	<form
		method="post"
		action="?/save&pagina={data.activePage}&limba={data.locale}"
		use:enhance={() => {
			saving = true;
			return async ({ result, update }) => {
				saving = false;
				if (result.type === 'success') {
					dirtyFields = new Set();
					isDirty = false;
				}
				await update({ reset: false });
			};
		}}
	>
		<input type="hidden" name="locale" value={data.locale} />
		<input type="hidden" name="expertiseOrder" value={JSON.stringify(expertiseOrder)} />
		<input type="hidden" name="contactEntries" value={JSON.stringify(contactEntries)} />

		{#each Object.entries(data.sections) as [section, fields]}
			{@const label = data.sectionLabels[section] ?? section}
			{@const icon = sectionIcons[section] ?? '📝'}
			{@const overrideCount = countOverrides(section)}
			{@const regularFields = fields.filter(f => !f.isStat && !f.isStatTitle && !f.isExpertiseText && !f.isAboutText)}
			{@const hasStats = fields.some(f => f.isStat || f.isStatTitle)}

			<div class="section-card">
				<button type="button" class="section-toggle" onclick={() => toggleSection(section)}>
					<div class="section-toggle-left">
						<span class="section-icon">{icon}</span>
						<span class="section-arrow" class:expanded={expandedSections[section]}>▶</span>
						<h2>{label}</h2>
					</div>
					<div class="section-meta">
						{#if overrideCount > 0}
							<span class="override-badge">{overrideCount} modificat{overrideCount > 1 ? 'e' : 'ă'}</span>
						{/if}
						<span class="field-count">{fields.length} câmpuri</span>
					</div>
				</button>

				<div class="section-body" class:collapsed={!expandedSections[section]}>
					<!-- Stats panel with titles -->
					{#if hasStats}
						<div class="sub-panel stats-panel">
							<div class="sub-panel-header">
								<h3>📊 Statistici Globale</h3>
							</div>
							<p class="sub-panel-hint">Editează valorile și etichetele statisticilor afișate pe site.</p>
							<div class="stats-grid">
								{#each statPairs as pair}
									{@const titleF = fields.find(f => f.key === pair.titleKey)}
									{@const valueF = fields.find(f => f.key === pair.valueKey)}
									{#if valueF}
										<div class="stat-card" class:dirty={dirtyFields.has(pair.valueKey) || dirtyFields.has(pair.titleKey)}>
											{#if titleF}
												<input
													type="text"
													name="field:{titleF.key}"
													value={titleF.override ?? titleF.defaultValue}
													placeholder={titleF.defaultValue}
													class="stat-title-input"
													oninput={() => markDirty(titleF.key)}
												/>
											{/if}
											<input
												type="text"
												name="field:{valueF.key}"
												class="stat-input"
												value={valueF.override ?? valueF.defaultValue}
												placeholder={valueF.defaultValue}
												oninput={() => markDirty(valueF.key)}
											/>
										</div>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					<!-- Expertise panel (merged reorder + edit) -->
					{#if section === 'expertise' && data.activePage === 'main'}
						<div class="sub-panel">
							<div class="sub-panel-header">
								<h3>⚖️ Domenii de Practică</h3>
							</div>
							<p class="sub-panel-hint">Trage pentru a rearanja ordinea. Editează titlul și descrierea direct.</p>
							<div class="expertise-cards">
								{#each expertiseOrder as key, i}
									{@const titleField = fields.find(f => f.key === `expertise.${key}`)}
									{@const descField = fields.find(f => f.key === `expertise.${key}Desc`)}
									<div
										class="expertise-card"
										class:dragging={expertiseDragIdx === i}
										draggable="true"
										role="listitem"
										ondragstart={() => expDrag.start(i)}
										ondragover={(e) => expDrag.over(e, i)}
										ondragend={expDrag.end}
									>
										<div class="expertise-card-left">
											<span class="drag-handle">⠿</span>
											<span class="sort-number">{String(i + 1).padStart(2, '0')}</span>
										</div>
										<div class="expertise-card-fields">
											{#if titleField}
												<input
													type="text"
													id="field-{titleField.key}"
													name="field:{titleField.key}"
													value={titleField.override ?? titleField.defaultValue}
													placeholder={titleField.defaultValue}
													class="expertise-title-input"
													oninput={() => markDirty(titleField.key)}
												/>
											{/if}
											{#if descField}
												<textarea
													id="field-{descField.key}"
													name="field:{descField.key}"
													rows="2"
													placeholder={descField.defaultValue}
													class="expertise-desc-input"
													oninput={() => markDirty(descField.key)}
												>{descField.override ?? descField.defaultValue}</textarea>
											{/if}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- About combined text (main page) -->
					{#if section === 'about'}
						{@const aboutFields = fields.filter(f => f.isAboutText)}
						{#if aboutFields.length > 0}
							<div class="sub-panel">
								<div class="sub-panel-header">
									<h3>📝 Text Despre Cabinet</h3>
								</div>
								<p class="sub-panel-hint">Editează textul secțiunii. Separă paragrafele cu o linie goală.</p>
								<textarea
									class="about-textarea"
									rows="8"
									bind:value={aboutText}
									oninput={() => { markDirty('about.p1'); markDirty('about.p2'); markDirty('about.p3'); }}
								></textarea>
								<input type="hidden" name="field:about.p1" value={aboutParts[0]} />
								<input type="hidden" name="field:about.p2" value={aboutParts[1]} />
								<input type="hidden" name="field:about.p3" value={aboutParts[2]} />
							</div>
						{/if}
					{/if}

					<!-- About page combined text panels -->
					{#if section === 'aboutPage'}
						{@const bioFields = fields.filter(f => ['aboutPage.bio1', 'aboutPage.bio2', 'aboutPage.bio3'].includes(f.key))}
						{@const philoFields = fields.filter(f => ['aboutPage.philosophy1', 'aboutPage.philosophy2'].includes(f.key))}
						{#if bioFields.length > 0}
							<div class="sub-panel">
								<div class="sub-panel-header">
									<h3>📝 Biografie</h3>
								</div>
								<p class="sub-panel-hint">Editează textul biografiei. Separă paragrafele cu o linie goală.</p>
								<textarea
									class="about-textarea"
									rows="8"
									bind:value={aboutPageBioText}
									oninput={() => { markDirty('aboutPage.bio1'); markDirty('aboutPage.bio2'); markDirty('aboutPage.bio3'); }}
								></textarea>
								<input type="hidden" name="field:aboutPage.bio1" value={bioParts[0]} />
								<input type="hidden" name="field:aboutPage.bio2" value={bioParts[1]} />
								<input type="hidden" name="field:aboutPage.bio3" value={bioParts[2]} />
							</div>
						{/if}
						{#if philoFields.length > 0}
							<div class="sub-panel">
								<div class="sub-panel-header">
									<h3>💡 Filosofie Profesională</h3>
								</div>
								<p class="sub-panel-hint">Editează textul filosofiei. Separă paragrafele cu o linie goală.</p>
								<textarea
									class="about-textarea"
									rows="6"
									bind:value={aboutPagePhiloText}
									oninput={() => { markDirty('aboutPage.philosophy1'); markDirty('aboutPage.philosophy2'); }}
								></textarea>
								<input type="hidden" name="field:aboutPage.philosophy1" value={philoParts[0]} />
								<input type="hidden" name="field:aboutPage.philosophy2" value={philoParts[1]} />
							</div>
						{/if}
					{/if}

					<!-- Contact entries -->
					{#if section === 'contact' && data.activePage === 'main'}
						<div class="sub-panel">
							<div class="sub-panel-header">
								<h3>📋 Informații Contact</h3>
								<button type="button" class="panel-add-btn" onclick={addContactEntry}>+ Adaugă</button>
							</div>
							<p class="sub-panel-hint">Administrează informațiile de contact. Trage pentru a rearanja ordinea.</p>
							<div class="contact-entries">
								{#each contactEntries as entry, i}
									<div
										class="contact-entry-row"
										class:dragging={contactDragIdx === i}
										draggable="true"
										role="listitem"
										ondragstart={() => contactDrag.start(i)}
										ondragover={(e) => contactDrag.over(e, i)}
										ondragend={contactDrag.end}
									>
										<span class="drag-handle">⠿</span>
										<div class="entry-fields">
											<div class="entry-top-row">
												<select
													class="entry-type"
													value={entry.type}
													onchange={(e) => updateContactType(i, (e.target as HTMLSelectElement).value)}
												>
													{#each contactTypes as ct}
														<option value={ct.value}>{ct.label}</option>
													{/each}
												</select>
												<input type="text" class="entry-label" placeholder="Etichetă" bind:value={entry.label} oninput={() => markDirty()} />
											</div>
											<textarea class="entry-value" placeholder="Valoare" rows="2" bind:value={entry.value} oninput={() => markDirty()}></textarea>
											{#if entry.type === 'custom'}
												<input type="text" class="entry-prefix" placeholder="Prefix link (opțional)" bind:value={entry.linkPrefix} oninput={() => markDirty()} />
											{/if}
										</div>
										<button type="button" class="entry-remove" title="Elimină" onclick={() => removeContactEntry(i)}>✕</button>
									</div>
								{/each}
								{#if contactEntries.length === 0}
									<p class="panel-empty">Nicio intrare. Adaugă una cu butonul de mai sus.</p>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Regular text fields -->
					{#if regularFields.length > 0}
						<div class="section-fields">
							{#each regularFields as field}
								<div class="field-row" class:dirty={dirtyFields.has(field.key)} class:auto-translated={field.isAutoTranslated}>
									<div class="field-header">
										<div class="field-label-group">
											<label for="field-{field.key}">
												{#if field.friendlyLabel}
													<span class="friendly-label">{field.friendlyLabel}</span>
													<span class="key-label">{field.key}</span>
												{:else}
													{field.key}
												{/if}
											</label>
											{#if field.isAutoTranslated}
												<span class="auto-badge" title="Tradus automat cu AI">AI</span>
											{/if}
										</div>
										<div class="field-actions">
											{#if field.historyCount > 0}
												<button type="button" class="history-btn" class:active={historyOpen === field.key} title="Istoric ({field.historyCount})" onclick={() => toggleHistory(field.key)}>🕓 {field.historyCount}</button>
											{/if}
											{#if field.override !== null}
												<button type="button" class="reset-btn" title="Resetează" onclick={() => resetField(field.key)}>↩</button>
											{/if}
										</div>
									</div>
									{#if field.isLongText}
										<textarea
											id="field-{field.key}"
											name="field:{field.key}"
											rows="3"
											placeholder={field.defaultValue}
											oninput={() => markDirty(field.key)}
										>{field.override ?? field.defaultValue}</textarea>
									{:else}
										<input
											type="text"
											id="field-{field.key}"
											name="field:{field.key}"
											value={field.override ?? field.defaultValue}
											placeholder={field.defaultValue}
											oninput={() => markDirty(field.key)}
										/>
									{/if}
									{#if historyOpen === field.key}
										<div class="history-panel">
											{#if historyLoading}
												<p class="history-loading">Se încarcă...</p>
											{:else if historyEntries.length === 0}
												<p class="history-empty">Niciun istoric.</p>
											{:else}
												{#each historyEntries as entry}
													<div class="history-entry">
														<div class="history-entry-header">
															<span class="history-type">{changeTypeLabels[entry.changeType] ?? entry.changeType}</span>
															<span class="history-date">{formatDate(entry.changedAt)}</span>
														</div>
														<div class="history-value">{entry.value}</div>
														<button type="button" class="history-restore-btn" onclick={() => restoreVersion(entry.id)}>Restaurează</button>
													</div>
												{/each}
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/each}

		<div class="save-bar">
			<button type="submit" class="save-btn" disabled={saving}>
				{saving ? 'Se salvează...' : 'Salvează Modificările'}
			</button>
		</div>
	</form>
</div>

<style>
	.content-page { max-width: 960px; }

	.page-header {
		display: flex; justify-content: space-between; align-items: flex-start;
		margin-bottom: 24px; gap: 24px; flex-wrap: wrap;
	}
	h1 { font-family: var(--font-serif); font-size: 36px; font-weight: 400; margin-bottom: 8px; }
	.subtitle { color: var(--gray); font-size: 15px; font-weight: 300; }

	/* Page tabs */
	.page-tabs {
		display: flex; gap: 0; border-bottom: 2px solid var(--border);
		margin-bottom: 28px; overflow-x: auto;
	}
	.page-tab {
		padding: 14px 24px; font-size: 14px; font-weight: 500; color: var(--gray);
		text-decoration: none; border-bottom: 2px solid transparent; margin-bottom: -2px;
		transition: all 0.2s ease; white-space: nowrap; font-family: var(--font-sans);
	}
	.page-tab:hover { color: var(--primary); }
	.page-tab.active { color: var(--primary); border-bottom-color: var(--primary); }

	/* Locale picker */
	.locale-picker { display: flex; align-items: center; gap: 8px; }
	.locale-picker label { font-size: 14px; color: var(--gray); font-weight: 500; }
	.locale-picker select { padding: 8px 12px; border: 1px solid var(--border); font-size: 14px; font-family: var(--font-sans); background: white; }

	/* Toasts */
	.toast { padding: 12px 20px; margin-bottom: 16px; font-size: 14px; font-weight: 500; }
	.toast.success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
	.toast.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

	/* Translate bar */
	.translate-bar {
		display: flex; justify-content: space-between; align-items: center;
		padding: 16px 24px; background: #eff6ff; border: 1px solid #bfdbfe;
		margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
	}
	.translate-info { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #1e40af; }
	.translate-icon { font-size: 20px; }
	.translate-btn {
		padding: 10px 24px; background: #1e40af; color: white; border: none;
		font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--font-sans);
		transition: background 0.2s ease; white-space: nowrap;
	}
	.translate-btn:hover:not(:disabled) { background: #1d4ed8; }
	.translate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

	/* Section cards */
	.section-card { background: white; border: 1px solid var(--border); margin-bottom: 12px; }
	.section-toggle {
		width: 100%; display: flex; justify-content: space-between; align-items: center;
		padding: 20px 24px; background: none; border: none; cursor: pointer;
		font-family: var(--font-sans); text-align: left;
	}
	.section-toggle:hover { background: #fafafa; }
	.section-toggle-left { display: flex; align-items: center; gap: 10px; }
	.section-icon { font-size: 18px; }
	.section-arrow { font-size: 11px; color: var(--gray); transition: transform 0.2s ease; display: inline-block; }
	.section-arrow.expanded { transform: rotate(90deg); }
	h2 { font-family: var(--font-serif); font-size: 20px; font-weight: 400; color: var(--primary); }
	.section-meta { display: flex; align-items: center; gap: 12px; }
	.override-badge { font-size: 12px; background: var(--secondary); color: white; padding: 2px 10px; font-weight: 500; }
	.field-count { font-size: 13px; color: var(--gray); }

	/* Section body */
	.section-body { border-top: 1px solid var(--border); }
	.section-body.collapsed { display: none; }

	/* Sub-panels */
	.sub-panel {
		padding: 20px 24px; border-bottom: 1px solid var(--border); background: #fafaf9;
	}
	.sub-panel-header {
		display: flex; justify-content: space-between; align-items: center;
		margin-bottom: 6px; gap: 12px; flex-wrap: wrap;
	}
	.sub-panel-header h3 {
		font-family: var(--font-serif); font-size: 16px; font-weight: 500;
		color: var(--primary); margin: 0;
	}
	.sub-panel-hint { font-size: 12px; color: var(--gray); margin-bottom: 14px; font-weight: 300; }

	/* Stats grid */
	.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
	.stat-card {
		background: white; border: 1px solid var(--border); padding: 16px;
		display: flex; flex-direction: column; gap: 6px; transition: border-color 0.2s;
	}
	.stat-card.dirty { border-color: var(--secondary); }
	.stat-title-input {
		font-size: 12px !important; font-weight: 600 !important; color: var(--gray) !important;
		text-align: center; padding: 4px 8px !important; border: 1px dashed var(--border) !important;
		background: transparent !important;
	}
	.stat-title-input:focus { border-color: var(--secondary) !important; border-style: solid !important; }
	.stat-input {
		font-size: 24px !important; font-family: var(--font-serif) !important;
		font-weight: 600 !important; text-align: center; padding: 8px !important;
		color: var(--primary) !important; letter-spacing: 0.5px;
	}

	/* Panel buttons */
	.panel-add-btn {
		padding: 8px 20px; background: none; border: 1px solid var(--border);
		color: var(--primary); font-size: 13px; font-weight: 500; cursor: pointer;
		font-family: var(--font-sans); transition: all 0.2s ease;
	}
	.panel-add-btn:hover { border-color: var(--primary); }
	.panel-empty { font-size: 13px; color: var(--gray); font-style: italic; }

	/* Expertise cards (merged reorder + edit) */
	.expertise-cards { display: flex; flex-direction: column; gap: 4px; }
	.expertise-card {
		display: flex; align-items: flex-start; gap: 12px;
		padding: 14px 16px; background: white; border: 1px solid var(--border);
		cursor: grab; transition: all 0.15s ease; user-select: none;
	}
	.expertise-card:hover { background: var(--light); }
	.expertise-card.dragging { opacity: 0.5; background: #eff6ff; border-color: #bfdbfe; }
	.expertise-card-left {
		display: flex; align-items: center; gap: 8px;
		padding-top: 8px; flex-shrink: 0;
	}
	.expertise-card-fields { flex: 1; display: flex; flex-direction: column; gap: 6px; }
	.expertise-title-input {
		font-family: var(--font-serif) !important; font-size: 15px !important;
		font-weight: 500 !important; color: var(--primary) !important;
		padding: 6px 10px !important; border: 1px solid transparent !important;
		background: transparent !important;
	}
	.expertise-title-input:focus { border-color: var(--secondary) !important; background: white !important; }
	.expertise-desc-input {
		font-size: 13px !important; color: var(--gray) !important;
		padding: 6px 10px !important; border: 1px solid transparent !important;
		background: transparent !important; resize: vertical;
	}
	.expertise-desc-input:focus { border-color: var(--secondary) !important; background: white !important; }
	.drag-handle { font-size: 16px; color: var(--gray); cursor: grab; }
	.sort-number { font-family: var(--font-serif); font-size: 14px; color: var(--secondary); font-weight: 300; min-width: 20px; }

	/* About combined textarea */
	.about-textarea {
		width: 100%; min-height: 160px; padding: 14px 16px;
		font-size: 14px; font-family: var(--font-sans); color: var(--primary);
		line-height: 1.7; border: 1px solid var(--border); background: white;
		resize: vertical;
	}
	.about-textarea:focus { outline: none; border-color: var(--secondary); }

	/* Contact entries */
	.contact-entries { display: flex; flex-direction: column; gap: 8px; }
	.contact-entry-row {
		display: flex; gap: 10px; align-items: flex-start;
		padding: 14px; background: white; border: 1px solid var(--border);
		cursor: grab; user-select: none; transition: all 0.15s ease;
	}
	.contact-entry-row:hover { background: var(--light); }
	.contact-entry-row.dragging { opacity: 0.5; background: #eff6ff; border-color: #bfdbfe; }
	.entry-fields { flex: 1; display: flex; flex-direction: column; gap: 8px; }
	.entry-top-row { display: flex; gap: 8px; }
	.entry-fields select, .entry-fields input, .entry-fields textarea {
		width: 100%; padding: 8px 12px; border: 1px solid var(--border);
		font-size: 13px; font-family: var(--font-sans); color: var(--primary);
		background: white; resize: vertical;
	}
	.entry-fields select:focus, .entry-fields input:focus, .entry-fields textarea:focus {
		outline: none; border-color: var(--secondary);
	}
	.entry-type { max-width: 150px; flex-shrink: 0; }
	.entry-prefix { max-width: 280px; }
	.entry-remove {
		background: none; border: 1px solid var(--border); width: 28px; height: 28px;
		display: flex; align-items: center; justify-content: center;
		cursor: pointer; color: var(--gray); font-size: 13px;
		transition: all 0.2s ease; flex-shrink: 0; margin-top: 2px;
	}
	.entry-remove:hover { border-color: #c53030; color: #c53030; background: #fef2f2; }

	/* Regular fields */
	.section-fields { padding: 0 24px 24px; }
	.field-row { padding: 16px 0; border-bottom: 1px solid #f0eeeb; }
	.field-row:last-child { border-bottom: none; }
	.field-row.dirty { background: #fffbf0; margin: 0 -24px; padding: 16px 24px; }
	.field-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
	.field-label-group { display: flex; align-items: center; gap: 8px; }
	.field-header label { font-size: 12px; font-weight: 600; color: var(--gray); letter-spacing: 0.5px; }
	.friendly-label { display: block; font-family: var(--font-sans); font-weight: 600; color: var(--primary); font-size: 13px; letter-spacing: 0; }
	.key-label { display: block; font-family: monospace; font-size: 11px; color: var(--gray); font-weight: 400; }
	.auto-badge { font-size: 10px; font-weight: 700; background: #dbeafe; color: #1e40af; padding: 1px 6px; letter-spacing: 0.5px; font-family: var(--font-sans); }
	.field-row.auto-translated { border-left: 3px solid #3b82f6; }

	.field-actions { display: flex; align-items: center; gap: 6px; }
	.reset-btn {
		background: none; border: 1px solid var(--border); font-size: 14px;
		cursor: pointer; padding: 2px 8px; color: var(--gray); font-family: var(--font-sans);
		transition: all 0.2s ease;
	}
	.reset-btn:hover { border-color: #c53030; color: #c53030; }
	.history-btn {
		background: none; border: 1px solid var(--border); font-size: 12px;
		cursor: pointer; padding: 2px 8px; color: var(--gray); font-family: var(--font-sans);
		transition: all 0.2s ease;
	}
	.history-btn:hover, .history-btn.active { border-color: #1e40af; color: #1e40af; background: #eff6ff; }

	/* History panel */
	.history-panel { margin-top: 10px; border: 1px solid var(--border); background: #fafaf9; max-height: 300px; overflow-y: auto; }
	.history-loading, .history-empty { padding: 12px 16px; font-size: 13px; color: var(--gray); font-style: italic; }
	.history-entry { padding: 10px 16px; border-bottom: 1px solid #f0eeeb; }
	.history-entry:last-child { border-bottom: none; }
	.history-entry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
	.history-type { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; color: var(--gray); }
	.history-date { font-size: 11px; color: var(--gray); }
	.history-value { font-size: 13px; color: var(--primary); margin-bottom: 6px; word-break: break-word; white-space: pre-wrap; background: white; padding: 6px 10px; border: 1px solid #f0eeeb; }
	.history-restore-btn {
		font-size: 11px; padding: 3px 10px; background: none; border: 1px solid var(--border);
		color: var(--gray); cursor: pointer; font-family: var(--font-sans); transition: all 0.2s ease;
	}
	.history-restore-btn:hover { border-color: var(--secondary); color: var(--secondary); background: #fef3e2; }

	/* Input fields */
	input[type='text'], textarea {
		width: 100%; padding: 10px 14px; border: 1px solid var(--border);
		font-size: 14px; font-family: var(--font-sans); color: var(--primary);
		background: white; transition: border-color 0.2s ease; resize: vertical;
	}
	input[type='text']:focus, textarea:focus { outline: none; border-color: var(--secondary); }

	/* Save bar */
	.save-bar {
		position: sticky; bottom: 0; background: white;
		border-top: 1px solid var(--border); padding: 16px 0;
		margin-top: 24px; display: flex; justify-content: flex-end;
	}
	.save-btn {
		padding: 14px 40px; background: var(--primary); color: white; border: none;
		font-size: 14px; font-weight: 500; cursor: pointer; font-family: var(--font-sans);
		transition: background 0.3s ease;
	}
	.save-btn:hover { background: var(--secondary); }
	.save-btn:disabled { opacity: 0.6; cursor: wait; }

	@media (max-width: 768px) {
		.page-tabs { gap: 0; }
		.page-tab { padding: 12px 16px; font-size: 13px; }
		.sub-panel { padding: 16px; }
		.stats-grid { grid-template-columns: repeat(2, 1fr); }
		.entry-top-row { flex-direction: column; }
		.contact-entry-row { flex-direction: column; }
		.entry-remove { align-self: flex-end; }
		.expertise-card { flex-direction: column; }
		.expertise-card-left { padding-top: 0; }
	}
</style>
