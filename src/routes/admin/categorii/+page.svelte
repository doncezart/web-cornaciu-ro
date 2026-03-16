<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let editingId: number | null = $state(null);
	let editName = $state('');
</script>

<div class="page">
	<div class="page-header">
		<h1>Categorii</h1>
		<p class="subtitle">Gestionează categoriile articolelor</p>
	</div>

	{#if form?.success}
		<div class="success">Operațiune reușită.</div>
	{/if}
	{#if form?.message}
		<div class="error-msg" role="alert">{form.message}</div>
	{/if}

	<div class="grid">
		<div class="list-section">
			{#if data.categories.length === 0}
				<p class="empty">Nu există categorii. Adaugă una mai jos.</p>
			{:else}
				{#each data.categories as cat (cat.id)}
					<div class="category-item">
						{#if editingId === cat.id}
							<form method="post" action="?/update" use:enhance class="edit-form">
								<input type="hidden" name="id" value={cat.id} />
								<input type="text" name="name" bind:value={editName} required class="edit-input" />
								<button type="submit" class="btn-small btn-save">Salvează</button>
								<button type="button" class="btn-small" onclick={() => editingId = null}>Anulează</button>
							</form>
						{:else}
							<span class="cat-name">{cat.name}</span>
							<span class="cat-count">{cat.articleCount} {cat.articleCount === 1 ? 'articol' : 'articole'}</span>
							<div class="item-actions">
								<button
									type="button"
									class="btn-small"
									onclick={() => { editingId = cat.id; editName = cat.name; }}
								>
									Editează
								</button>
								<form method="post" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Sigur dorești să ștergi această categorie?')) e.preventDefault(); }}>
									<input type="hidden" name="id" value={cat.id} />
									<button type="submit" class="btn-small btn-danger">Șterge</button>
								</form>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		<div class="form-section">
			<div class="form-card">
				<h2>Categorie Nouă</h2>
				<form method="post" action="?/create" use:enhance>
					<div class="field">
						<label for="name">Nume</label>
						<input type="text" id="name" name="name" required placeholder="ex: Drept Civil" />
					</div>
					<button type="submit" class="btn-submit">Adaugă</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.page-header { margin-bottom: 32px; }

	h1 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
	}

	.subtitle {
		color: var(--gray);
		margin-top: 8px;
		font-size: 15px;
	}

	.success {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #166534;
		padding: 14px 20px;
		margin-bottom: 24px;
		font-size: 14px;
	}

	.error-msg {
		background: #fff5f5;
		border: 1px solid #fed7d7;
		color: #c53030;
		padding: 14px 20px;
		margin-bottom: 24px;
		font-size: 14px;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 360px;
		gap: 32px;
	}

	.category-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: white;
		border: 1px solid var(--border);
		padding: 16px 20px;
		margin-bottom: 8px;
	}

	.cat-name {
		font-size: 15px;
		font-weight: 500;
	}

	.cat-count {
		font-size: 12px;
		color: var(--gray);
		background: var(--light);
		padding: 2px 10px;
		border: 1px solid var(--border);
	}

	.item-actions {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.edit-form {
		display: flex;
		gap: 8px;
		align-items: center;
		width: 100%;
	}

	.edit-input {
		flex: 1;
		padding: 8px 12px;
		border: 1px solid var(--secondary);
		font-size: 14px;
		font-family: var(--font-sans);
	}

	.edit-input:focus {
		outline: none;
		border-color: var(--primary);
	}

	.btn-small {
		padding: 6px 14px;
		font-size: 12px;
		border: 1px solid var(--border);
		background: white;
		color: var(--primary);
		cursor: pointer;
		font-family: var(--font-sans);
		white-space: nowrap;
	}

	.btn-small:hover { border-color: var(--primary); }
	.btn-save { background: var(--primary); color: white; border-color: var(--primary); }
	.btn-save:hover { background: var(--secondary); border-color: var(--secondary); }
	.btn-danger { color: #c53030; border-color: #fed7d7; }
	.btn-danger:hover { border-color: #c53030; background: #fff5f5; }

	.form-card {
		background: white;
		border: 1px solid var(--border);
		padding: 32px;
	}

	h2 {
		font-family: var(--font-serif);
		font-size: 24px;
		font-weight: 500;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border);
	}

	.field { margin-bottom: 20px; }

	label {
		display: block;
		font-size: 13px;
		color: var(--gray);
		font-weight: 600;
		margin-bottom: 8px;
	}

	input[type='text'] {
		width: 100%;
		padding: 12px 14px;
		border: 1px solid var(--border);
		font-size: 15px;
		font-family: var(--font-sans);
		color: var(--primary);
	}

	input:focus {
		outline: none;
		border-color: var(--secondary);
	}

	.btn-submit {
		padding: 12px 28px;
		background: var(--primary);
		color: white;
		border: none;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: background 0.3s ease;
	}

	.btn-submit:hover { background: var(--secondary); }

	.empty { color: var(--gray); padding: 32px 0; }

	@media (max-width: 968px) {
		.grid { grid-template-columns: 1fr; }
	}
</style>
