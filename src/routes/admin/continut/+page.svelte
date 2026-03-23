<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let saving = $state(false);
	let translating = $state(false);
	let translateResult = $state<{ count: number; error?: string } | null>(null);
	let expandedSections = $state<Record<string, boolean>>({});
	let historyOpen = $state<string | null>(null);
	let historyEntries = $state<{ id: number; value: string; changeType: string; changedAt: string | null }[]>([]);
	let historyLoading = $state(false);

	const changeTypeLabels: Record<string, string> = {
		edit: 'Editare manuală',
		delete: 'Resetare',
		translate: 'Traducere AI',
		restore: 'Restaurare'
	};

	function toggleSection(section: string) {
		expandedSections[section] = !expandedSections[section];
	}

	function switchLocale(e: Event) {
		const select = e.target as HTMLSelectElement;
		translateResult = null;
		historyOpen = null;
		goto(`/admin/continut?limba=${select.value}`);
	}

	function countOverrides(section: string): number {
		return data.sections[section]?.filter((f) => f.override !== null).length ?? 0;
	}

	async function resetField(key: string) {
		const fd = new FormData();
		fd.set('key', key);
		fd.set('locale', data.locale);
		await fetch('?/reset', { method: 'POST', body: fd });
		goto(`/admin/continut?limba=${data.locale}`, { invalidateAll: true });
	}

	async function translateAll() {
		translating = true;
		translateResult = null;
		try {
			const fd = new FormData();
			fd.set('locale', data.locale);
			const res = await fetch('?/translate', { method: 'POST', body: fd });
			const html = await res.text();
			await invalidateAll();
			goto(`/admin/continut?limba=${data.locale}`, { invalidateAll: true });
		} catch (err) {
			translateResult = { count: 0, error: 'Eroare la traducere' };
		} finally {
			translating = false;
		}
	}

	async function toggleHistory(key: string) {
		if (historyOpen === key) {
			historyOpen = null;
			return;
		}
		historyLoading = true;
		historyOpen = key;
		historyEntries = [];
		try {
			const fd = new FormData();
			fd.set('key', key);
			fd.set('locale', data.locale);
			const res = await fetch('?/history', { method: 'POST', body: fd });
			const html = await res.text();
			// Parse the JSON data from the SvelteKit action response
			const match = html.match(/data-sveltekit-form-result="([^"]+)"/);
			if (match) {
				const decoded = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
				const parsed = JSON.parse(decoded);
				if (parsed.data?.historyEntries) {
					historyEntries = parsed.data.historyEntries;
				}
			}
		} catch {
			historyEntries = [];
		} finally {
			historyLoading = false;
		}
	}

	async function restoreVersion(historyId: number) {
		const fd = new FormData();
		fd.set('historyId', String(historyId));
		fd.set('locale', data.locale);
		await fetch('?/restore', { method: 'POST', body: fd });
		historyOpen = null;
		goto(`/admin/continut?limba=${data.locale}`, { invalidateAll: true });
	}

	function formatDate(iso: string | null): string {
		if (!iso) return '—';
		return new Date(iso).toLocaleString('ro-RO', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="content-page">
	<div class="page-header">
		<div>
			<h1>Conținut Site</h1>
			<p class="subtitle">Editează textele afișate pe site. Câmpurile goale folosesc textul implicit.</p>
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

	{#if data.locale !== 'ro'}
		<div class="translate-bar">
			<div class="translate-info">
				<span class="translate-icon">🌐</span>
				{#if data.pendingTranslations > 0}
					<span><strong>{data.pendingTranslations}</strong> câmpuri necesită traducere{data.pendingTranslations > 1 ? '' : ''} din română.</span>
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
				{#if translating}
					Se traduce...
				{:else}
					Traducere AI ({data.pendingTranslations})
				{/if}
			</button>
		</div>
	{/if}

	<form
		method="post"
		action="?/save"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				saving = false;
				await update();
			};
		}}
	>
		<input type="hidden" name="locale" value={data.locale} />

		{#each Object.entries(data.sections) as [section, fields]}
			{@const label = data.sectionLabels[section] ?? section}
			{@const overrideCount = countOverrides(section)}
			<div class="section-card">
				<button type="button" class="section-toggle" onclick={() => toggleSection(section)}>
					<div class="section-toggle-left">
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

				{#if expandedSections[section]}
					<div class="section-fields">
						{#each fields as field}
							<div class="field-row" class:has-override={field.override !== null} class:auto-translated={field.isAutoTranslated}>
								<div class="field-header">
									<div class="field-label-group">
										<label for="field-{field.key}">{field.key}</label>
										{#if field.isAutoTranslated}
											<span class="auto-badge" title="Tradus automat cu AI">AI</span>
										{/if}
									</div>
									<div class="field-actions">
										{#if field.historyCount > 0}
											<button
												type="button"
												class="history-btn"
												class:active={historyOpen === field.key}
												title="Istoric versiuni ({field.historyCount})"
												onclick={() => toggleHistory(field.key)}
											>
												🕓 {field.historyCount}
											</button>
										{/if}
										{#if field.override !== null}
											<button type="button" class="reset-btn" title="Resetează la implicit" onclick={() => resetField(field.key)}>↩</button>
										{/if}
									</div>
								</div>
								{#if field.defaultValue.length > 80}
									<textarea
										id="field-{field.key}"
										name="field:{field.key}"
										rows="3"
										placeholder={field.defaultValue}
									>{field.override ?? field.defaultValue}</textarea>
								{:else}
									<input
										type="text"
										id="field-{field.key}"
										name="field:{field.key}"
										value={field.override ?? field.defaultValue}
										placeholder={field.defaultValue}
									/>
								{/if}
								{#if field.override !== null}
									<span class="default-hint">Implicit: {field.defaultValue}</span>
								{/if}
								{#if historyOpen === field.key}
									<div class="history-panel">
										{#if historyLoading}
											<p class="history-loading">Se încarcă istoricul...</p>
										{:else if historyEntries.length === 0}
											<p class="history-empty">Niciun istoric disponibil.</p>
										{:else}
											{#each historyEntries as entry}
												<div class="history-entry">
													<div class="history-entry-header">
														<span class="history-type">{changeTypeLabels[entry.changeType] ?? entry.changeType}</span>
														<span class="history-date">{formatDate(entry.changedAt)}</span>
													</div>
													<div class="history-value">{entry.value}</div>
													<button
														type="button"
														class="history-restore-btn"
														onclick={() => restoreVersion(entry.id)}
													>Restaurează</button>
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
		{/each}

		<div class="save-bar">
			<button type="submit" class="save-btn" disabled={saving}>
				{saving ? 'Se salvează...' : 'Salvează Modificările'}
			</button>
		</div>
	</form>
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

	.section-card {
		background: white;
		border: 1px solid var(--border);
		margin-bottom: 12px;
	}

	.section-toggle {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 24px;
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-sans);
		text-align: left;
	}

	.section-toggle:hover {
		background: #fafafa;
	}

	.section-toggle-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.section-arrow {
		font-size: 12px;
		color: var(--gray);
		transition: transform 0.2s ease;
		display: inline-block;
	}

	.section-arrow.expanded {
		transform: rotate(90deg);
	}

	h2 {
		font-family: var(--font-serif);
		font-size: 20px;
		font-weight: 400;
		color: var(--primary);
	}

	.section-meta {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.override-badge {
		font-size: 12px;
		background: var(--secondary);
		color: white;
		padding: 2px 10px;
		font-weight: 500;
	}

	.field-count {
		font-size: 13px;
		color: var(--gray);
	}

	.section-fields {
		padding: 0 24px 24px;
		border-top: 1px solid var(--border);
	}

	.field-row {
		padding: 16px 0;
		border-bottom: 1px solid #f0eeeb;
	}

	.field-row:last-child {
		border-bottom: none;
	}

	.field-row.has-override {
		background: #fffbf0;
		margin: 0 -24px;
		padding: 16px 24px;
	}

	.field-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.field-header label {
		font-size: 12px;
		font-weight: 600;
		color: var(--gray);
		letter-spacing: 0.5px;
		font-family: monospace;
	}

	.field-label-group {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.auto-badge {
		font-size: 10px;
		font-weight: 700;
		background: #dbeafe;
		color: #1e40af;
		padding: 1px 6px;
		letter-spacing: 0.5px;
		font-family: var(--font-sans);
	}

	.field-row.auto-translated {
		border-left: 3px solid #3b82f6;
	}

	.reset-btn {
		background: none;
		border: 1px solid var(--border);
		font-size: 14px;
		cursor: pointer;
		padding: 2px 8px;
		color: var(--gray);
		font-family: var(--font-sans);
		transition: all 0.2s ease;
	}

	.reset-btn:hover {
		border-color: #c53030;
		color: #c53030;
	}

	.field-actions {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.history-btn {
		background: none;
		border: 1px solid var(--border);
		font-size: 12px;
		cursor: pointer;
		padding: 2px 8px;
		color: var(--gray);
		font-family: var(--font-sans);
		transition: all 0.2s ease;
	}

	.history-btn:hover,
	.history-btn.active {
		border-color: #1e40af;
		color: #1e40af;
		background: #eff6ff;
	}

	.history-panel {
		margin-top: 10px;
		border: 1px solid var(--border);
		background: #fafaf9;
		max-height: 300px;
		overflow-y: auto;
	}

	.history-loading,
	.history-empty {
		padding: 12px 16px;
		font-size: 13px;
		color: var(--gray);
		font-style: italic;
	}

	.history-entry {
		padding: 10px 16px;
		border-bottom: 1px solid #f0eeeb;
	}

	.history-entry:last-child {
		border-bottom: none;
	}

	.history-entry-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}

	.history-type {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.3px;
		color: var(--gray);
	}

	.history-date {
		font-size: 11px;
		color: var(--gray);
	}

	.history-value {
		font-size: 13px;
		color: var(--primary);
		margin-bottom: 6px;
		word-break: break-word;
		white-space: pre-wrap;
		background: white;
		padding: 6px 10px;
		border: 1px solid #f0eeeb;
	}

	.history-restore-btn {
		font-size: 11px;
		padding: 3px 10px;
		background: none;
		border: 1px solid var(--border);
		color: var(--gray);
		cursor: pointer;
		font-family: var(--font-sans);
		transition: all 0.2s ease;
	}

	.history-restore-btn:hover {
		border-color: var(--secondary);
		color: var(--secondary);
		background: #fef3e2;
	}

	input[type='text'],
	textarea {
		width: 100%;
		padding: 10px 14px;
		border: 1px solid var(--border);
		font-size: 14px;
		font-family: var(--font-sans);
		color: var(--primary);
		background: white;
		transition: border-color 0.2s ease;
		resize: vertical;
	}

	input[type='text']:focus,
	textarea:focus {
		outline: none;
		border-color: var(--secondary);
	}

	.default-hint {
		display: block;
		font-size: 12px;
		color: var(--gray);
		margin-top: 4px;
		font-style: italic;
	}

	.save-bar {
		position: sticky;
		bottom: 0;
		background: white;
		border-top: 1px solid var(--border);
		padding: 16px 0;
		margin-top: 24px;
		display: flex;
		justify-content: flex-end;
	}

	.save-btn {
		padding: 14px 40px;
		background: var(--primary);
		color: white;
		border: none;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: background 0.3s ease;
	}

	.save-btn:hover {
		background: var(--secondary);
	}

	.save-btn:disabled {
		opacity: 0.6;
		cursor: wait;
	}
</style>
