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
		<h1>Studii de Caz</h1>
		<a href="/admin/studii-de-caz/nou" class="btn-new">+ Studiu de Caz Nou</a>
	</div>

	{#if data.caseStudies.length === 0}
		<p class="empty">Nu există studii de caz. Creează primul studiu de caz.</p>
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
					{#each data.caseStudies as cs}
						<tr>
							<td class="title-cell">
								<a href="/admin/studii-de-caz/{cs.id}">
									{#if cs.featured}<span class="featured-badge" title="Favorit">⭐</span>{/if}
									{cs.title}
								</a>
							</td><td><span class="lang-badge"><img src={localeFlags[cs.lang as Locale] ?? ''} alt={cs.lang} class="flag-img" /></span></td>							<td><span class="badge">{cs.category}</span></td>
							<td>
								<span class="status" class:published={cs.published}>
									{cs.published ? 'Publicat' : 'Ciornă'}
								</span>
							</td>
							<td>{formatDate(cs.createdAt)}</td>
							<td class="actions-cell">
								<form method="post" action="?/toggleFeatured" use:enhance>
									<input type="hidden" name="id" value={cs.id} />
									<input type="hidden" name="featured" value={String(cs.featured)} />
									<button type="submit" class="btn-small" title={cs.featured ? 'Scoate de pe prima pagină' : 'Adaugă pe prima pagină'}>
										{cs.featured ? '★' : '☆'}
									</button>
								</form>
								<form method="post" action="?/togglePublish" use:enhance>
									<input type="hidden" name="id" value={cs.id} />
									<input type="hidden" name="published" value={String(cs.published)} />
									<button type="submit" class="btn-small">
										{cs.published ? 'Retrage' : 'Publică'}
									</button>
								</form>
								<a href="/admin/studii-de-caz/{cs.id}" class="btn-small">Editează</a>
							<form method="post" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Sigur dorești să ștergi acest studiu de caz?')) e.preventDefault(); }}>
									<input type="hidden" name="id" value={cs.id} />
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
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.btn-small {
		padding: 6px 14px;
		font-size: 13px;
		border: 1px solid var(--border);
		background: white;
		color: var(--primary);
		cursor: pointer;
		text-decoration: none;
		font-family: var(--font-sans);
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
	}

	.btn-small:hover {
		border-color: var(--primary);
	}

	.btn-danger {
		color: #dc2626;
		border-color: #fecaca;
	}

	.btn-danger:hover {
		background: #dc2626;
		color: white;
		border-color: #dc2626;
	}
</style>
