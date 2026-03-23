<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	const entityLabels: Record<string, string> = {
		article: 'Articol',
		category: 'Categorie',
		testimonial: 'Testimonial',
		content: 'Conținut Site',
		legal: 'Pagini Legale',
		ai: 'AI',
		upload: 'Upload',
		auth: 'Autentificare'
	};

	const actionLabels: Record<string, string> = {
		'article.create': 'Articol creat',
		'article.update': 'Articol editat',
		'article.delete': 'Articol șters',
		'article.togglePublish': 'Publicare articol',
		'article.toggleFeatured': 'Featured articol',
		'article.translation.create': 'Traducere creată',
		'article.translation.update': 'Traducere editată',
		'article.translation.delete': 'Traducere ștearsă',
		'article.translation.togglePublish': 'Publicare traducere',
		'category.create': 'Categorie creată',
		'category.update': 'Categorie editată',
		'category.delete': 'Categorie ștearsă',
		'testimonial.create': 'Testimonial creat',
		'testimonial.edit': 'Testimonial editat',
		'testimonial.delete': 'Testimonial șters',
		'testimonial.togglePublish': 'Publicare testimonial',
		'content.save': 'Conținut salvat',
		'content.reset': 'Câmp resetat',
		'content.translate': 'Traducere AI conținut',
		'content.restore': 'Câmp restaurat',
		'legal.save': 'Pagină legală salvată',
		'legal.translate': 'Traducere AI pagină legală',
		'ai.generateImage': 'Imagine generată AI',
		'ai.translateArticle': 'Articol tradus AI',
		'ai.summarize': 'Rezumat generat AI',
		'upload.image': 'Imagine încărcată',
		'auth.signOut': 'Deconectare'
	};

	const entityColors: Record<string, string> = {
		article: '#2563eb',
		category: '#7c3aed',
		testimonial: '#059669',
		content: '#d97706',
		legal: '#4f46e5',
		ai: '#db2777',
		upload: '#0891b2',
		auth: '#6b7280'
	};

	function formatDate(iso: string | null): string {
		if (!iso) return '—';
		const d = new Date(iso);
		return d.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
			' ' + d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	}

	function formatDetails(details: Record<string, unknown> | null): string {
		if (!details) return '';
		const parts: string[] = [];
		for (const [key, value] of Object.entries(details)) {
			if (value === null || value === undefined) continue;
			if (Array.isArray(value)) {
				if (value.length === 0) continue;
				parts.push(`${key}: ${value.length} câmpuri`);
			} else if (typeof value === 'boolean') {
				parts.push(`${key}: ${value ? 'da' : 'nu'}`);
			} else {
				const str = String(value);
				parts.push(`${key}: ${str.length > 60 ? str.slice(0, 60) + '…' : str}`);
			}
		}
		return parts.join(' · ');
	}
</script>

<svelte:head>
	<title>Logs | Admin</title>
</svelte:head>

<div class="logs-page">
	<div class="page-header">
		<h1>Jurnal Activitate</h1>
		<span class="total-badge">{data.totalCount} evenimente</span>
	</div>

	<div class="filters">
		<form method="get" class="filter-form">
			<label>
				Entitate
				<select name="entitate" onchange={(e) => e.currentTarget.form?.submit()}>
					<option value="">Toate</option>
					{#each data.entities as entity}
						<option value={entity} selected={data.entityFilter === entity}>
							{entityLabels[entity] ?? entity}
						</option>
					{/each}
				</select>
			</label>
			{#if data.actionFilter}
				<input type="hidden" name="actiune" value={data.actionFilter} />
			{/if}
		</form>
		{#if data.entityFilter || data.actionFilter}
			<a href="/admin/logs" class="clear-filter">✕ Șterge filtre</a>
		{/if}
	</div>

	{#if data.logs.length === 0}
		<div class="empty-state">
			<p>Nu există evenimente înregistrate{data.entityFilter ? ' pentru acest filtru' : ''}.</p>
		</div>
	{:else}
		<div class="logs-table-wrapper">
			<table class="logs-table">
				<thead>
					<tr>
						<th>Data</th>
						<th>Acțiune</th>
						<th>Detalii</th>
						<th>Utilizator</th>
					</tr>
				</thead>
				<tbody>
					{#each data.logs as log}
						<tr>
							<td class="date-cell">{formatDate(log.createdAt)}</td>
							<td class="action-cell">
								<span class="entity-badge" style="background: {entityColors[log.entity] ?? '#6b7280'}">
									{entityLabels[log.entity] ?? log.entity}
								</span>
								<span class="action-label">{actionLabels[log.action] ?? log.action}</span>
								{#if log.entityId}
									<span class="entity-id">#{log.entityId}</span>
								{/if}
							</td>
							<td class="details-cell">
								{formatDetails(log.details)}
							</td>
							<td class="user-cell">{log.userEmail ?? '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.totalPages > 1}
			<div class="pagination">
				{#if data.page > 1}
					<a href="/admin/logs?pagina={data.page - 1}{data.entityFilter ? '&entitate=' + data.entityFilter : ''}{data.actionFilter ? '&actiune=' + data.actionFilter : ''}" class="page-link">← Anterioare</a>
				{/if}
				<span class="page-info">Pagina {data.page} din {data.totalPages}</span>
				{#if data.page < data.totalPages}
					<a href="/admin/logs?pagina={data.page + 1}{data.entityFilter ? '&entitate=' + data.entityFilter : ''}{data.actionFilter ? '&actiune=' + data.actionFilter : ''}" class="page-link">Următoare →</a>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.logs-page {
		max-width: 1200px;
	}

	.page-header {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
	}

	.page-header h1 {
		font-family: var(--font-serif);
		font-size: 28px;
		font-weight: 600;
		color: var(--primary);
		margin: 0;
	}

	.total-badge {
		background: var(--primary);
		color: white;
		font-size: 13px;
		padding: 4px 12px;
		border-radius: 12px;
	}

	.filters {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
	}

	.filter-form {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.filter-form label {
		font-size: 14px;
		color: #555;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.filter-form select {
		padding: 6px 12px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 14px;
		font-family: var(--font-sans);
		background: white;
	}

	.clear-filter {
		font-size: 13px;
		color: #dc2626;
		text-decoration: none;
	}

	.clear-filter:hover {
		text-decoration: underline;
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: #888;
	}

	.logs-table-wrapper {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	}

	.logs-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.logs-table thead {
		background: #fafafa;
	}

	.logs-table th {
		text-align: left;
		padding: 12px 16px;
		font-weight: 600;
		color: #555;
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid #eee;
	}

	.logs-table td {
		padding: 12px 16px;
		border-bottom: 1px solid #f5f5f5;
		vertical-align: top;
	}

	.logs-table tbody tr:hover {
		background: #fafafa;
	}

	.date-cell {
		white-space: nowrap;
		color: #888;
		font-size: 13px;
		font-variant-numeric: tabular-nums;
	}

	.action-cell {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.entity-badge {
		display: inline-block;
		color: white;
		font-size: 11px;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.3px;
		white-space: nowrap;
	}

	.action-label {
		font-weight: 500;
		color: #333;
	}

	.entity-id {
		color: #aaa;
		font-size: 12px;
	}

	.details-cell {
		color: #666;
		font-size: 13px;
		max-width: 400px;
		word-break: break-word;
	}

	.user-cell {
		color: #888;
		font-size: 13px;
		white-space: nowrap;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 16px;
		margin-top: 24px;
	}

	.page-link {
		color: var(--primary);
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
	}

	.page-link:hover {
		text-decoration: underline;
	}

	.page-info {
		color: #888;
		font-size: 14px;
	}

	@media (max-width: 768px) {
		.logs-table-wrapper {
			overflow-x: auto;
		}

		.logs-table {
			min-width: 700px;
		}

		.page-header h1 {
			font-size: 22px;
		}
	}
</style>
