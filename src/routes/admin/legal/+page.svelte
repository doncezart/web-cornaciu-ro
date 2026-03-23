<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';

	let { data, form } = $props();

	let activeSlug = $state('');
	let activeLocale = $state('');
	let saving = $state(false);
	let translating = $state(false);

	$effect(() => {
		activeSlug = data.activeSlug;
		activeLocale = data.activeLocale;
	});

	function getContent(slug: string, locale: string): string {
		return data.content[slug]?.[locale]?.content ?? '';
	}

	function getUpdatedAt(slug: string, locale: string): string | null {
		const d = data.content[slug]?.[locale]?.updatedAt;
		if (!d) return null;
		return new Date(d).toLocaleString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	function switchPage(slug: string) {
		activeSlug = slug;
		goto(`?pagina=${slug}&limba=${activeLocale}`, { replaceState: true, noScroll: true });
	}

	function switchLocale(locale: string) {
		activeLocale = locale;
		goto(`?pagina=${activeSlug}&limba=${locale}`, { replaceState: true, noScroll: true });
	}
</script>

<div class="content-page">
	<div class="page-header">
		<div>
			<h1>Pagini Legale</h1>
			<p class="subtitle">Editează conținutul paginilor legale în format Markdown.</p>
		</div>
		<div class="locale-picker">
			<label for="locale-select">Limbă:</label>
			<select id="locale-select" onchange={(e) => switchLocale(e.currentTarget.value)} value={activeLocale}>
				{#each data.locales as loc}
					<option value={loc}>{data.localeLabels[loc]}</option>
				{/each}
			</select>
		</div>
	</div>

	{#if form?.success}
		<div class="toast success">✓ Modificările au fost salvate.</div>
	{/if}
	{#if form?.translated}
		<div class="toast success">✓ Pagina a fost tradusă cu succes.</div>
	{/if}
	{#if form?.error}
		<div class="toast error">{form.error}</div>
	{/if}

	<!-- Page tabs -->
	<div class="page-tabs">
		{#each data.pages as p}
			<button
				type="button"
				class="page-tab"
				class:active={activeSlug === p.slug}
				onclick={() => switchPage(p.slug)}
			>
				{p.label}
			</button>
		{/each}
	</div>

	<!-- Translate bar for non-RO locales -->
	{#if activeLocale !== 'ro'}
		<div class="translate-bar">
			<div class="translate-info">
				<span class="translate-icon">🌐</span>
				<span>Traduceți această pagină automat din română în <strong>{data.localeLabels[activeLocale]}</strong>.</span>
			</div>
			<form method="post" action="?/translate&pagina={activeSlug}&limba={activeLocale}" use:enhance={() => {
				translating = true;
				return async ({ update }) => {
					await update();
					translating = false;
				};
			}}>
				<input type="hidden" name="slug" value={activeSlug} />
				<input type="hidden" name="sourceLocale" value="ro" />
				<input type="hidden" name="targetLocale" value={activeLocale} />
				<button type="submit" class="translate-btn" disabled={translating}>
					{translating ? 'Se traduce...' : 'Traducere AI'}
				</button>
			</form>
		</div>
	{/if}

	<!-- Editor -->
	{#key `${activeSlug}-${activeLocale}`}
		<form
			method="post"
			action="?/save&pagina={activeSlug}&limba={activeLocale}"
			use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					saving = false;
					await update();
				};
			}}
		>
			<input type="hidden" name="slug" value={activeSlug} />
			<input type="hidden" name="locale" value={activeLocale} />

			{#if getUpdatedAt(activeSlug, activeLocale)}
				<p class="updated-at">Ultima actualizare: {getUpdatedAt(activeSlug, activeLocale)}</p>
			{/if}

			<MarkdownEditor
				name="content"
				value={getContent(activeSlug, activeLocale)}
				placeholder="Scrieți conținutul paginii legale aici..."
			/>

			<div class="save-bar">
				<button type="submit" class="save-btn" disabled={saving}>
					{saving ? 'Se salvează...' : 'Salvează Modificările'}
				</button>
			</div>
		</form>
	{/key}
</div>

<style>
	.content-page {
		max-width: 960px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 32px;
		gap: 24px;
		flex-wrap: wrap;
	}

	h1 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
		margin-bottom: 8px;
	}

	.subtitle {
		color: var(--gray);
		font-size: 15px;
		font-weight: 300;
	}

	.locale-picker {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.locale-picker label {
		font-size: 14px;
		color: var(--gray);
		font-weight: 500;
	}

	.locale-picker select {
		padding: 8px 12px;
		border: 1px solid var(--border);
		font-size: 14px;
		font-family: var(--font-sans);
		background: white;
	}

	.toast {
		padding: 12px 20px;
		margin-bottom: 24px;
		font-size: 14px;
		font-weight: 500;
	}

	.toast.success {
		background: #f0fdf4;
		color: #166534;
		border: 1px solid #bbf7d0;
	}

	.toast.error {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fecaca;
	}

	.page-tabs {
		display: flex;
		gap: 0;
		margin-bottom: 24px;
		border-bottom: 2px solid var(--border);
	}

	.page-tab {
		padding: 12px 24px;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 14px;
		font-weight: 500;
		color: var(--gray);
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		transition: all 0.15s;
		font-family: var(--font-sans);
	}

	.page-tab:hover {
		color: var(--secondary);
	}

	.page-tab.active {
		color: var(--secondary);
		border-bottom-color: var(--secondary);
	}

	.translate-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 24px;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		margin-bottom: 24px;
		gap: 16px;
		flex-wrap: wrap;
	}

	.translate-info {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 14px;
		color: #1e40af;
	}

	.translate-icon {
		font-size: 20px;
	}

	.translate-btn {
		padding: 10px 24px;
		background: #1e40af;
		color: white;
		border: none;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: background 0.2s ease;
		white-space: nowrap;
	}

	.translate-btn:hover:not(:disabled) {
		background: #1d4ed8;
	}

	.translate-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.updated-at {
		font-size: 13px;
		color: var(--gray);
		margin-bottom: 12px;
	}

	.save-bar {
		margin-top: 24px;
		padding-top: 24px;
		border-top: 1px solid var(--border);
		display: flex;
		justify-content: flex-end;
	}

	.save-btn {
		padding: 12px 32px;
		background: var(--secondary);
		color: white;
		border: none;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: background 0.2s ease;
	}

	.save-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.save-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
