<script lang="ts">
	import { enhance } from '$app/forms';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import { localeNames } from '$lib/i18n';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let imageUrl = $state('');
	let uploadingCover = $state(false);
	let generatingCover = $state(false);
	let publishNow = $state(false);
	let saving = $state(false);
	let dirty = $state(false);
	let summarizing = $state(false);
	let selectedLang = $state('ro');

	$effect(() => {
		const handler = (e: BeforeUnloadEvent) => {
			if (dirty && !saving) {
				e.preventDefault();
			}
		};
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	});

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
</script>

<div class="page">
	<div class="page-header">
		<div>
			<a href="/admin/articole" class="back">← Înapoi la articole</a>
			<h1>Articol Nou</h1>
		</div>
		<div class="header-actions">
			<button type="submit" form="article-form" class="btn-save" disabled={saving}>
				{saving ? 'Se salvează...' : 'Salvează'}
			</button>
			<button type="button" class="publish-toggle" class:published={publishNow} onclick={() => publishNow = !publishNow}>
				{publishNow ? '✓ Va fi publicat' : 'Publică'}
			</button>
		</div>
	</div>

	<form id="article-form" method="post" action="?/create" use:enhance={() => { saving = true; dirty = false; return async ({ update }) => { saving = false; await update(); }; }} class="article-form" oninput={() => dirty = true}>
		<input type="hidden" name="published" value={publishNow ? 'on' : ''} />
		<div class="form-grid">
			<div class="form-main">
				<div class="field">
					<label for="title">Titlu</label>
					<input type="text" id="title" name="title" required placeholder="Titlul articolului" />
				</div>

				<div class="field">
					<div class="field-header">
						<label for="excerpt">Rezumat</label>
						<button type="button" class="btn-ai" onclick={aiSummarize} disabled={summarizing}>
							{summarizing ? '⏳ Generez...' : '🤖 Generează cu AI'}
						</button>
					</div>
					<textarea id="excerpt" name="excerpt" rows="3" placeholder="Scurt rezumat al articolului"></textarea>
				</div>

				<div class="field">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label>Conținut (Markdown)</label>
					<MarkdownEditor placeholder="Scrie articolul aici folosind Markdown..." />
				</div>
			</div>

			<div class="form-sidebar">
				<div class="sidebar-card">
					<h3>Limba</h3>
					<div class="field">
						<label for="lang">Limba articolului</label>
						<select id="lang" name="lang" bind:value={selectedLang}>
							{#each data.locales as loc}
								<option value={loc}>{localeNames[loc]}</option>
							{/each}
						</select>
					</div>
					<p class="info-hint">Salvează articolul pentru a adăuga traduceri.</p>
				</div>

				<div class="sidebar-card">
					<h3>Detalii</h3>
					<div class="field">
						<label for="category">Categorie</label>
						<select id="category" name="category" required>
							<option value="">Selectează...</option>
							{#each data.categories as cat}
								<option value={cat.name}>{cat.name}</option>
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

	h1 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
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

	.field {
		margin-bottom: 20px;
	}

	.field-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.field-header label {
		margin-bottom: 0;
	}

	.btn-ai {
		padding: 6px 14px;
		background: var(--primary);
		color: white;
		border: none;
		font-size: 12px;
		font-family: var(--font-sans);
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.btn-ai:hover { background: var(--secondary); }
	.btn-ai:disabled { opacity: 0.6; cursor: wait; }

	label {
		display: block;
		font-size: 13px;
		letter-spacing: 0.5px;
		color: var(--gray);
		font-weight: 600;
		margin-bottom: 8px;
	}

	input[type='text'],
	textarea,
	select {
		width: 100%;
		padding: 12px 14px;
		border: 1px solid var(--border);
		font-size: 15px;
		font-family: var(--font-sans);
		color: var(--primary);
		background: var(--white);
		transition: border-color 0.3s ease;
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: var(--secondary);
	}

	textarea {
		resize: vertical;
	}

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

	.error {
		color: #c53030;
		font-size: 14px;
		margin-top: 16px;
	}

	.info-hint {
		font-size: 12px;
		color: var(--gray);
		margin-top: 8px;
		font-style: italic;
	}

	@media (max-width: 968px) {
		.form-grid { grid-template-columns: 1fr; }
	}
</style>
