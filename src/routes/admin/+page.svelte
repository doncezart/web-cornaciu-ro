<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="dashboard">
	<h1>Dashboard</h1>
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-value">{data.articleCount}</span>
			<span class="stat-label">Articole</span>
			<a href="/admin/articole">Gestionează →</a>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.testimonialCount}</span>
			<span class="stat-label">Testimoniale</span>
			<a href="/admin/testimoniale">Gestionează →</a>
		</div>
		<div class="stat-card">
			<span class="stat-value">{data.categoryCount}</span>
			<span class="stat-label">Categorii</span>
			<a href="/admin/categorii">Gestionează →</a>
		</div>
	</div>

	{#if data.categoryCounts.length > 0}
		<div class="category-stats">
			<h2>Articole per Categorie</h2>
			<div class="category-list">
				{#each data.categoryCounts as cat}
					<div class="category-row">
						<span class="cat-name">{cat.name}</span>
						<span class="cat-count">{cat.count} {cat.count === 1 ? 'articol' : 'articole'}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="quick-actions">
		<h2>Acțiuni Rapide</h2>
		<div class="actions">
			<a href="/admin/articole/nou" class="action-btn">+ Articol Nou</a>
		</div>
	</div>
</div>

<style>
	h1 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
		margin-bottom: 40px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 24px;
		margin-bottom: 48px;
	}

	.stat-card {
		background: white;
		border: 1px solid var(--border);
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.stat-value {
		font-family: var(--font-serif);
		font-size: 48px;
		font-weight: 300;
		color: var(--secondary);
	}

	.stat-label {
		font-size: 14px;
		color: var(--gray);
		text-transform: uppercase;
		letter-spacing: 1px;
		font-weight: 600;
	}

	.stat-card a {
		color: var(--primary);
		font-size: 14px;
		text-decoration: none;
		margin-top: 12px;
		font-weight: 500;
	}

	.stat-card a:hover {
		color: var(--secondary);
	}

	h2 {
		font-family: var(--font-serif);
		font-size: 28px;
		font-weight: 400;
		margin-bottom: 24px;
	}

	.category-stats {
		background: white;
		border: 1px solid var(--border);
		padding: 32px;
		margin-bottom: 48px;
	}

	.category-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.category-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border);
	}

	.category-row:last-child { border-bottom: none; }

	.cat-name {
		font-size: 15px;
		font-weight: 500;
		color: var(--primary);
	}

	.cat-count {
		font-size: 13px;
		color: var(--gray);
	}

	.actions {
		display: flex;
		gap: 16px;
	}

	.action-btn {
		padding: 14px 28px;
		background: var(--primary);
		color: white;
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		transition: background 0.3s ease;
	}

	.action-btn:hover {
		background: var(--secondary);
	}
</style>
