<script lang="ts">
	import { enhance } from '$app/forms';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import { localeNames, localeFlags, type Locale } from '$lib/i18n';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	const a = $derived(data.article);
	let imageUrl = $state('');
	let uploadingCover = $state(false);
	let generatingCover = $state(false);
	let regenerateSlug = $state(false);
	let saving = $state(false);
	let dirty = $state(false);
	let summarizing = $state(false);

	// Translation state
	let activeTab = $state('main');
	let translating = $state<string | null>(null);
	let savingTranslation = $state<string | null>(null);

	type TranslationEntry = {
		id?: number;
		title: string;
		excerpt: string;
		content: string;
		published: boolean;
	};

	let translations = $state<Record<string, TranslationEntry>>(
		Object.fromEntries(['ro', 'en', 'bg'].map(l => [l, { title: '', excerpt: '', content: '', published: false }]))
	);
	const otherLangs = $derived(data.locales.filter((l): l is Locale => l !== a.lang));

	$effect(() => {
		imageUrl = data.article.imageUrl ?? '';

		const t: Record<string, TranslationEntry> = {};
		for (const lang of data.locales.filter(l => l !== data.article.lang)) {
			const existing = data.translations.find((tr) => tr.lang === lang);
			t[lang] = existing
				? { id: existing.id, title: existing.title, excerpt: existing.excerpt || '', content: existing.content, published: existing.published ?? false }
				: { title: '', excerpt: '', content: '', published: false };
		}
		translations = t;
	});

	$effect(() => {
		const handler = (e: BeforeUnloadEvent) => {
			if (dirty && !saving) {
				e.preventDefault();
			}
		};
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	});

	function formatDate(date: string | Date | null): string {
		if (!date) return '';
		return new Intl.DateTimeFormat('ro-RO', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(date));
	}

	async function aiGenerateCover() {
		const title = (document.getElementById('title') as HTMLInputElement)?.value;
		const content = (document.querySelector('input[name="content"]') as HTMLInputElement)?.value
			|| (document.querySelector('textarea[name="content"]') as HTMLTextAreaElement)?.value;
		if (!title) { alert('Scrie titlul articolului mai întâi.'); return; }
		generatingCover = true;
		try {
			const res = await fetch('/api/generate-image', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, content: content?.slice(0, 500) || '' })
			});
			if (res.ok) {
				const { url } = await res.json();
				imageUrl = url;
			} else {
				alert('Eroare la generarea imaginii.');
			}
		} finally {
			generatingCover = false;
		}
	}

	async function aiSummarize() {
		const title = (document.getElementById('title') as HTMLInputElement)?.value;
		const content = (document.querySelector('input[name="content"]') as HTMLInputElement)?.value
			|| (document.querySelector('textarea[name="content"]') as HTMLTextAreaElement)?.value;
		if (!content) { alert('Scrie conținutul articolului mai întâi.'); return; }
		summarizing = true;
		try {
			const res = await fetch('/api/summarize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, content })
			});
			if (res.ok) {
				const { summary } = await res.json();
				const textarea = document.getElementById('excerpt') as HTMLTextAreaElement;
				if (textarea) { textarea.value = summary; textarea.dispatchEvent(new Event('input', { bubbles: true })); }
			} else {
				alert('Eroare la generarea rezumatului.');
			}
		} finally {
			summarizing = false;
		}
	}

	async function uploadCover() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			uploadingCover = true;
			try {
				const fd = new FormData();
				fd.append('file', file);
				const res = await fetch('/api/upload', { method: 'POST', body: fd });
				if (res.ok) {
					const { url } = await res.json();
					imageUrl = url;
				} else {
					alert('Eroare la upload');
				}
			} finally {
				uploadingCover = false;
			}
		};
		input.click();
	}

	async function aiTranslate(targetLang: string) {
		translating = targetLang;
		try {
			const res = await fetch('/api/translate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: a.title,
					excerpt: a.excerpt || '',
					content: a.content,
					sourceLang: a.lang,
					targetLang
				})
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				alert(err.message || 'Eroare la traducere');
				return;
			}
			const result = await res.json();
			translations[targetLang] = {
				...translations[targetLang],
				title: result.title,
				excerpt: result.excerpt || '',
				content: result.content
			};
		} catch {
			alert('Eroare la conexiunea cu serverul');
		} finally {
			translating = null;
		}
	}
</script>

<div class="page">
	<div class="page-header">
		<div>
			<a href="/admin/articole" class="back">← Înapoi la articole</a>
			<h1>Editează Articolul</h1>
		</div>
		<div class="header-actions">
			{#if dirty && a.published}
				<span class="unsaved-badge">● Modificări nesalvate</span>
			{/if}
			<button type="submit" form="article-form" class="btn-save" disabled={saving}>
				{saving ? 'Se salvează...' : 'Salvează'}
			</button>
			<form method="post" action="?/togglePublish" use:enhance={() => { return async ({ update }) => { await update(); }; }}>
				<button type="submit" class="publish-toggle" class:published={a.published}>
					{a.published ? '✓ Publicat' : 'Publică'}
				</button>
			</form>
		</div>
	</div>

	{#if form?.success}
		<div class="success">Articolul a fost actualizat cu succes.</div>
	{/if}

	{#if form?.translationSaved}
		<div class="success">Traducerea a fost salvată.</div>
	{/if}
	{#if form?.translationDeleted}
		<div class="success">Traducerea a fost ștearsă.</div>
	{/if}

	<div class="lang-tabs">
		<button class="lang-tab" class:active={activeTab === 'main'} type="button" onclick={() => activeTab = 'main'}>
			<img class="flag-img" src={localeFlags[a.lang as Locale]} alt={a.lang} /> {localeNames[a.lang as Locale]}
			<span class="tab-badge source">sursă</span>
		</button>
		{#each otherLangs as lang}
			<button class="lang-tab" class:active={activeTab === lang} type="button" onclick={() => activeTab = lang}>
				<img class="flag-img" src={localeFlags[lang]} alt={lang} /> {localeNames[lang]}
				{#if translations[lang]?.id}
					<span class="tab-badge exists">✓</span>
				{:else if translations[lang]?.content}
					<span class="tab-badge draft">●</span>
				{:else}
					<span class="tab-badge empty">+</span>
				{/if}
			</button>
		{/each}
	</div>

	<div class="tab-content" class:active={activeTab === 'main'}>
	<form id="article-form" method="post" action="?/update" use:enhance={() => { saving = true; dirty = false; return async ({ update }) => { saving = false; await update(); }; }} class="article-form" oninput={() => dirty = true}>
		<input type="hidden" name="published" value={a.published ? 'on' : ''} />
		<div class="form-grid">
			<div class="form-main">
				<div class="field">
					<label for="title">Titlu</label>
					<input type="text" id="title" name="title" value={a.title} required />
				</div>

				<div class="field">
					<div class="field-header">
						<label for="excerpt">Rezumat</label>
						<button type="button" class="btn-ai" onclick={aiSummarize} disabled={summarizing}>
							{summarizing ? '⏳ Generez...' : '🤖 Generează cu AI'}
						</button>
					</div>
					<textarea id="excerpt" name="excerpt" rows="3">{a.excerpt ?? ''}</textarea>
				</div>

				<div class="field">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label>Conținut (Markdown)</label>
					<MarkdownEditor value={a.content} />
				</div>
			</div>

			<div class="form-sidebar">
				<div class="sidebar-card">
					<h3>Opțiuni</h3>
					<label class="checkbox-label">
						<input type="checkbox" name="featured" checked={a.featured ?? false} />
						⭐ Favorit (pe prima pagină)
					</label>
					{#if a.slug}
						<a href="/articole/{a.slug}" class="view-link" target="_blank">Vizualizează →</a>
					{/if}
				</div>

				<div class="sidebar-card">
					<h3>Slug</h3>
					<p class="slug-display">/{a.slug}</p>
					<input type="hidden" name="regenerateSlug" value={regenerateSlug ? 'on' : ''} />
					<label class="checkbox-label" style="margin-top: 8px;">
						<input type="checkbox" bind:checked={regenerateSlug} />
						Regenerează din titlu
					</label>
				</div>

				<div class="sidebar-card">
					<h3>Limba</h3>
					<div class="field">
						<label for="lang">Limba articolului</label>
						<select id="lang" name="lang">
							{#each data.locales as loc}
								<option value={loc} selected={a.lang === loc}>{localeNames[loc]}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="sidebar-card">
					<h3>Traduceri</h3>
					<p class="info-text">Folosește tab-urile de mai sus pentru a gestiona traducerile.</p>
					{#each otherLangs as lang}
						<div class="translation-status">
						<span><img class="flag-img" src={localeFlags[lang]} alt={lang} /> {localeNames[lang]}</span>
							<span class="status-indicator" class:exists={!!translations[lang]?.id}>
								{translations[lang]?.id ? '✓ Tradus' : '— Lipsă'}
							</span>
						</div>
					{/each}
				</div>

				{#if a.publishedAt || (a.editHistory && a.editHistory.length > 0)}
					<div class="sidebar-card">
						<h3>Istoric</h3>
						{#if a.publishedAt}
							<div class="history-entry">
								<span class="history-label">Publicat:</span>
								<span class="history-date">{formatDate(a.publishedAt)}</span>
							</div>
						{/if}
						{#if a.editHistory && a.editHistory.length > 0}
							{#each a.editHistory.slice(-5).reverse() as edit}
								<div class="history-entry">
									<span class="history-label">Editat:</span>
									<span class="history-date">{formatDate(edit)}</span>
								</div>
							{/each}
							{#if a.editHistory.length > 5}
								<p class="history-more">...și alte {a.editHistory.length - 5} editări</p>
							{/if}
						{/if}
					</div>
				{/if}

				<div class="sidebar-card">
					<h3>Detalii</h3>
					<div class="field">
						<label for="category">Categorie</label>
						<select id="category" name="category" required>
							{#each data.categories as cat}
								<option value={cat.name} selected={a.category === cat.name}>{cat.name}</option>
							{/each}
						</select>
						<a href="/admin/categorii" class="manage-link">Gestionează categorii →</a>
					</div>

					<div class="field">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label>Imagine de copertă</label>
						<input type="hidden" name="imageUrl" value={imageUrl} />
						{#if imageUrl}
							<div class="cover-preview">
								<img src={imageUrl} alt="Copertă" />
								<button type="button" class="remove-cover" onclick={() => imageUrl = ''}>✕</button>
							</div>
						{:else}
						<div class="cover-buttons">
							<button type="button" class="upload-btn" onclick={uploadCover} disabled={uploadingCover || generatingCover}>
								{uploadingCover ? 'Se încarcă...' : '📷 Încarcă imagine'}
							</button>
							<button type="button" class="upload-btn btn-generate" onclick={aiGenerateCover} disabled={uploadingCover || generatingCover}>
								{generatingCover ? '⏳ Generez...' : '🎨 Generează cu AI'}
							</button>
						</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		{#if form?.message}
			<p class="error" role="alert">{form.message}</p>
		{/if}
	</form>
	</div>

	{#each otherLangs as lang}
		<div class="tab-content" class:active={activeTab === lang}>
				<div class="translation-header">
					<h2><img class="flag-img" src={localeFlags[lang]} alt={lang} /> Traducere — {localeNames[lang]}</h2>
					<div class="translation-actions-bar">
						{#if translations[lang]?.id}
							<form method="post" action="?/toggleTranslationPublish" use:enhance>
								<input type="hidden" name="translationId" value={translations[lang].id} />
								<button type="submit" class="publish-toggle" class:published={translations[lang]?.published}>
									{translations[lang]?.published ? '✓ Publicat' : 'Ciornă — Publică'}
								</button>
							</form>
						{/if}
						<button type="button" class="btn-ai" onclick={() => aiTranslate(lang)} disabled={translating !== null}>
							{#if translating === lang}
								<span class="spinner"></span> Se traduce...
							{:else}
								🤖 Traducere automată (AI)
							{/if}
						</button>
						{#if translations[lang]?.id}
							<form method="post" action="?/deleteTranslation" use:enhance onsubmit={(e) => { if (!confirm(`Sigur dorești să ștergi traducerea în ${localeNames[lang]}?`)) e.preventDefault(); }}>
								<input type="hidden" name="translationId" value={translations[lang].id} />
								<button type="submit" class="btn-delete-sm">🗑 Șterge</button>
							</form>
						{/if}
					</div>
				</div>

				<form method="post" action="?/saveTranslation" use:enhance={() => { savingTranslation = lang; return async ({ update }) => { savingTranslation = null; await update(); }; }}>
					<input type="hidden" name="lang" value={lang} />
					<input type="hidden" name="translationId" value={translations[lang]?.id ?? ''} />

					<div class="form-grid">
						<div class="form-main">
							<div class="field">
								<label for="tr-title-{lang}">Titlu</label>
								<input type="text" id="tr-title-{lang}" name="title" bind:value={translations[lang].title} required />
							</div>

							<div class="field">
								<label for="tr-excerpt-{lang}">Rezumat</label>
								<textarea id="tr-excerpt-{lang}" name="excerpt" rows="3" bind:value={translations[lang].excerpt}></textarea>
							</div>

							<div class="field">
								<!-- svelte-ignore a11y_label_has_associated_control -->
								<label>Conținut (Markdown)</label>
								<MarkdownEditor value={translations[lang].content} />
							</div>
						</div>

						<div class="form-sidebar">
							<div class="sidebar-card">
								<h3>Info</h3>
								<p class="info-text">
									Categoria și imaginea sunt sincronizate cu articolul sursă.
								</p>
							</div>
						</div>
					</div>

					{#if form?.message}
						<p class="error" role="alert">{form.message}</p>
					{/if}

					<div class="form-actions">
						<button type="submit" class="btn-submit" disabled={savingTranslation === lang}>
							{#if savingTranslation === lang}
								Se salvează...
							{:else if translations[lang]?.id}
								Actualizează Traducerea
							{:else}
								Salvează Traducerea
							{/if}
						</button>
					</div>
				</form>
			</div>
	{/each}
</div>

<style>
	.page-header {
		margin-bottom: 32px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.back {
		color: var(--gray);
		text-decoration: none;
		font-size: 14px;
		display: inline-block;
		margin-bottom: 16px;
	}
	.back:hover { color: var(--primary); }

	.publish-toggle {
		padding: 10px 24px;
		font-size: 14px;
		font-weight: 500;
		font-family: var(--font-sans);
		border: 1px solid var(--border);
		background: white;
		color: var(--gray);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.publish-toggle:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.publish-toggle.published {
		background: #16a34a;
		color: white;
		border-color: #16a34a;
	}

	.publish-toggle.published:hover {
		background: #dc2626;
		border-color: #dc2626;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.btn-save {
		padding: 10px 24px;
		font-size: 14px;
		font-weight: 500;
		font-family: var(--font-sans);
		background: var(--primary);
		color: white;
		border: 1px solid var(--primary);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.btn-save:hover {
		background: var(--secondary);
		border-color: var(--secondary);
	}

	.btn-save:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.unsaved-badge {
		font-size: 13px;
		color: #d97706;
		font-weight: 500;
		white-space: nowrap;
	}

	h1 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
	}

	.success {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #166534;
		padding: 14px 20px;
		margin-bottom: 24px;
		font-size: 14px;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 32px;
	}

	.form-main {
		min-width: 0;
	}

	.sidebar-card {
		background: white;
		border: 1px solid var(--border);
		padding: 32px;
		margin-bottom: 24px;
	}

	.sidebar-card h3 {
		font-family: var(--font-serif);
		font-size: 20px;
		font-weight: 500;
		margin-bottom: 20px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--border);
	}

	.field { margin-bottom: 20px; }

	.field-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.field-header label {
		margin-bottom: 0;
	}

	label {
		display: block;
		font-size: 13px;
		letter-spacing: 0.5px;
		color: var(--gray);
		font-weight: 600;
		margin-bottom: 8px;
	}

	input[type='text'], textarea, select {
		width: 100%;
		padding: 12px 14px;
		border: 1px solid var(--border);
		font-size: 15px;
		font-family: var(--font-sans);
		color: var(--primary);
		background: var(--white);
		transition: border-color 0.3s ease;
	}

	input:focus, textarea:focus, select:focus {
		outline: none;
		border-color: var(--secondary);
	}

	textarea { resize: vertical; }

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-size: 14px;
	}

	.checkbox-label input { width: auto; }

	.view-link {
		display: block;
		margin-top: 16px;
		color: var(--secondary);
		font-size: 14px;
		text-decoration: none;
	}

	.view-link:hover { color: var(--primary); }

	.manage-link {
		display: inline-block;
		margin-top: 8px;
		font-size: 12px;
		color: var(--secondary);
		text-decoration: none;
	}

	.manage-link:hover { color: var(--primary); }

	.upload-btn {
		width: 100%;
		padding: 12px;
		border: 2px dashed var(--border);
		background: #fafafa;
		cursor: pointer;
		font-size: 14px;
		font-family: var(--font-sans);
		color: var(--gray);
		transition: all 0.2s ease;
	}

	.upload-btn:hover {
		border-color: var(--secondary);
		color: var(--primary);
	}

	.upload-btn:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.cover-buttons {
		display: flex;
		gap: 8px;
	}

	.btn-generate {
		background: #6B5A3E;
		color: white;
		border-color: #6B5A3E;
	}

	.btn-generate:hover {
		background: #5a4b33;
		color: white;
	}

	.cover-preview {
		position: relative;
	}

	.cover-preview img {
		width: 100%;
		aspect-ratio: 16/9;
		object-fit: cover;
		border: 1px solid var(--border);
	}

	.remove-cover {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		font-size: 12px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.error { color: #c53030; font-size: 14px; margin-top: 16px; }

	.slug-display {
		font-family: monospace;
		font-size: 13px;
		color: var(--gray);
		word-break: break-all;
		background: var(--light);
		padding: 8px 12px;
		border: 1px solid var(--border);
	}

	.history-entry {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 0;
		border-bottom: 1px solid var(--border);
		font-size: 13px;
	}

	.history-entry:last-child { border-bottom: none; }

	.history-label {
		color: var(--gray);
		font-weight: 500;
	}

	.history-date {
		color: var(--primary);
		font-size: 12px;
	}

	.history-more {
		font-size: 12px;
		color: var(--gray);
		margin-top: 8px;
		font-style: italic;
	}

	.form-actions { margin-top: 24px; }

	.btn-submit {
		padding: 14px 32px;
		background: var(--primary);
		color: white;
		border: none;
		font-size: 15px;
		font-weight: 500;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: background 0.3s ease;
	}

	.btn-submit:hover { background: var(--secondary); }
	.btn-submit:disabled { opacity: 0.6; cursor: wait; }

	.tab-content { display: none; }
	.tab-content.active { display: block; }

	.lang-tabs {
		display: flex;
		gap: 0;
		border-bottom: 2px solid var(--border);
		margin-bottom: 32px;
	}

	.lang-tab {
		padding: 12px 24px;
		border: none;
		background: none;
		font-size: 14px;
		font-family: var(--font-sans);
		color: var(--gray);
		cursor: pointer;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: all 0.2s ease;
	}

	.lang-tab:hover { color: var(--primary); }
	.lang-tab.active {
		color: var(--primary);
		border-bottom-color: var(--secondary);
		font-weight: 600;
	}

	.flag-img {
		width: 20px;
		height: 14px;
		object-fit: cover;
		border-radius: 2px;
		vertical-align: middle;
	}

	.tab-badge {
		font-size: 11px;
		padding: 1px 6px;
		border-radius: 3px;
	}

	.tab-badge.source {
		background: var(--light);
		color: var(--gray);
	}

	.tab-badge.exists {
		background: #f0fdf4;
		color: #16a34a;
	}

	.tab-badge.draft {
		background: #fffbeb;
		color: #d97706;
	}

	.tab-badge.empty {
		background: var(--light);
		color: var(--gray);
	}

	.translation-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
	}

	.translation-header h2 {
		font-family: var(--font-serif);
		font-size: 28px;
		font-weight: 400;
	}

	.translation-actions-bar {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.btn-ai {
		padding: 10px 20px;
		background: var(--primary);
		color: white;
		border: none;
		font-size: 13px;
		font-family: var(--font-sans);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: background 0.3s ease;
	}

	.btn-ai:hover { background: var(--secondary); }
	.btn-ai:disabled { opacity: 0.6; cursor: wait; }

	.btn-delete-sm {
		padding: 10px 16px;
		background: white;
		color: #c53030;
		border: 1px solid #fed7d7;
		font-size: 13px;
		font-family: var(--font-sans);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-delete-sm:hover {
		border-color: #c53030;
		background: #fff5f5;
	}

	.spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255,255,255,0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.info-text {
		font-size: 13px;
		color: var(--gray);
		line-height: 1.5;
	}

	.translation-status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		font-size: 13px;
		border-bottom: 1px solid var(--border);
	}

	.translation-status:last-of-type { border-bottom: none; }

	.status-indicator { color: var(--gray); }
	.status-indicator.exists { color: #16a34a; }

	@media (max-width: 968px) {
		.form-grid { grid-template-columns: 1fr; }
		.lang-tabs { flex-wrap: wrap; }
		.translation-header { flex-direction: column; align-items: flex-start; gap: 16px; }
	}
</style>
