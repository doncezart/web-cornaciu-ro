<script lang="ts">
	import { enhance } from '$app/forms';
	import { localeFlags, type Locale } from '$lib/i18n';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	function formatDate(date: Date | null): string {
		if (!date) return '—';
		return new Intl.DateTimeFormat('ro-RO', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(new Date(date));
	}
</script>

<div class="page">
	<div class="page-header">
		<h1>Articole</h1>
		<a href="/admin/articole/nou" class="btn-new">+ Articol Nou</a>
	</div>

	{#if data.articles.length === 0}
		<p class="empty">Nu există articole. Creează primul articol.</p>
	{:else}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Titlu</th>
						<th>Limba</th>
						<th>Categorie</th>
						<th>Status</th>
						<th>Data</th>
						<th class="th-actions">Acțiuni</th>
					</tr>
				</thead>
				<tbody>
					{#each data.articles as art}
						<tr>
							<td class="title-cell">
								<a href="/admin/articole/{art.id}">
									{#if art.featured}<span class="featured-badge" title="Favorit">⭐</span>{/if}
									{art.title}
								</a>
							</td><td><span class="lang-badge"><img src={localeFlags[art.lang as Locale] ?? ''} alt={art.lang} class="flag-img" /></span></td>							<td><span class="badge">{art.category}</span></td>
							<td>
								<span class="status" class:published={art.published}>
									{art.published ? 'Publicat' : 'Ciornă'}
								</span>
							</td>
							<td>{formatDate(art.createdAt)}</td>
							<td class="actions-cell">
								<form method="post" action="?/toggleFeatured" use:enhance>
									<input type="hidden" name="id" value={art.id} />
									<input type="hidden" name="featured" value={String(art.featured)} />
									<button type="submit" class="btn-small" title={art.featured ? 'Scoate de pe prima pagină' : 'Adaugă pe prima pagină'}>
										{art.featured ? '★' : '☆'}
									</button>
								</form>
								<form method="post" action="?/togglePublish" use:enhance>
									<input type="hidden" name="id" value={art.id} />
									<input type="hidden" name="published" value={String(art.published)} />
									<button type="submit" class="btn-small">
										{art.published ? 'Retrage' : 'Publică'}
									</button>
								</form>
								<a href="/admin/articole/{art.id}" class="btn-small">Editează</a>
							<form method="post" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Sigur dorești să ștergi acest articol?')) e.preventDefault(); }}>
									<input type="hidden" name="id" value={art.id} />
									<button type="submit" class="btn-small btn-danger">Șterge</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
	}

	h1 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
	}

	.btn-new {
		padding: 12px 24px;
		background: var(--primary);
		color: white;
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		transition: background 0.3s ease;
	}

	.btn-new:hover {
		background: var(--secondary);
	}

	.empty {
		text-align: center;
		color: var(--gray);
		padding: 80px 0;
		font-size: 16px;
	}

	.table-wrap {
		background: white;
		border: 1px solid var(--border);
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		padding: 16px 20px;
		font-size: 12px;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: var(--gray);
		font-weight: 600;
		border-bottom: 1px solid var(--border);
		background: var(--light);
	}

	td {
		padding: 16px 20px;
		font-size: 14px;
		border-bottom: 1px solid var(--border);
		vertical-align: middle;
	}

	.title-cell {
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.title-cell a {
		color: var(--primary);
		text-decoration: none;
		font-weight: 500;
	}

	.title-cell a:hover {
		color: var(--secondary);
	}

	.featured-badge {
		margin-right: 4px;
	}

	.badge {
		font-size: 12px;
		padding: 4px 12px;
		background: var(--light);
		border: 1px solid var(--border);
		color: var(--gray);
		white-space: nowrap;
	}

	.lang-badge {
		display: inline-flex;
		align-items: center;
	}

	.flag-img {
		width: 22px;
		height: 15px;
		object-fit: cover;
		border-radius: 2px;
	}

	.status {
		font-size: 13px;
		color: var(--gray);
	}

	.status.published {
		color: #16a34a;
	}

	.actions-cell {
		white-space: nowrap;
		text-align: right;
	}

	.th-actions {
		text-align: right;
	}

	.actions-cell form {
		display: inline;
	}

	.btn-small {
		padding: 6px 12px;
		font-size: 12px;
		border: 1px solid var(--border);
		background: white;
		color: var(--primary);
		cursor: pointer;
		font-family: var(--font-sans);
		text-decoration: none;
		transition: all 0.2s ease;
		display: inline-block;
	}

	.btn-small:hover {
		border-color: var(--primary);
	}

	.btn-danger {
		color: #c53030;
		border-color: #fed7d7;
	}

	.btn-danger:hover {
		border-color: #c53030;
		background: #fff5f5;
	}

	@media (max-width: 900px) {
		.table-wrap {
			border: none;
			background: none;
			overflow: visible;
		}

		table, thead, tbody, tr, th, td {
			display: block;
		}

		thead {
			display: none;
		}

		tr {
			background: white;
			border: 1px solid var(--border);
			margin-bottom: 12px;
			padding: 16px;
		}

		td {
			border-bottom: none;
			padding: 4px 0;
		}

		.title-cell {
			max-width: none;
			white-space: normal;
			overflow: visible;
			font-size: 16px;
			margin-bottom: 8px;
		}

		.actions-cell {
			text-align: left;
			margin-top: 12px;
			padding-top: 12px;
			border-top: 1px solid var(--border);
		}
	}
</style>
