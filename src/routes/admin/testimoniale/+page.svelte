<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let editingId = $state<number | null>(null);
</script>

<div class="page">
	<div class="page-header">
		<h1>Testimoniale</h1>
	</div>

	{#if form?.success}
		<div class="success">Operațiune reușită.</div>
	{/if}

	<div class="grid">
		<div class="list">
			{#if data.testimonials.length === 0}
				<p class="empty">Nu există testimoniale.</p>
			{:else}
				{#each data.testimonials as t}
					<div class="testimonial-item">
						{#if editingId === t.id}
							<form method="post" action="?/edit" use:enhance={() => { return async ({ update }) => { editingId = null; update(); }; }}>
								<input type="hidden" name="id" value={t.id} />
								<div class="field">
									<label for="edit-quote-{t.id}">Citat</label>
									<textarea id="edit-quote-{t.id}" name="quote" rows="3" placeholder="Ce a spus clientul...">{t.quote ?? ''}</textarea>
								</div>
								<div class="field">
									<label for="edit-name-{t.id}">Nume</label>
									<input type="text" id="edit-name-{t.id}" name="authorName" required value={t.authorName} />
								</div>
								<div class="field">
									<label for="edit-title-{t.id}">Funcție / Companie</label>
									<input type="text" id="edit-title-{t.id}" name="authorTitle" value={t.authorTitle ?? ''} />
								</div>
								<div class="field">
									<label for="edit-rating-{t.id}">Rating (1-5)</label>
									<input type="number" id="edit-rating-{t.id}" name="rating" value={t.rating ?? 5} min="1" max="5" />
								</div>
								<div class="edit-actions">
									<button type="submit" class="btn-small btn-save">Salvează</button>
									<button type="button" class="btn-small" onclick={() => editingId = null}>Anulează</button>
								</div>
							</form>
						{:else}
							{#if t.quote}
								<p class="quote">"{t.quote}"</p>
							{/if}
							<div class="meta">
								<strong>{t.authorName}</strong>
								{#if t.authorTitle}
									<span>— {t.authorTitle}</span>
								{/if}
								<span class="stars">{'★'.repeat(t.rating ?? 5)}</span>
							</div>
							<div class="item-actions">
								<span class="status" class:published={t.published}>
									{t.published ? 'Publicat' : 'Ascuns'}
								</span>
								<button type="button" class="btn-small" onclick={() => editingId = t.id}>Editează</button>
								<form method="post" action="?/togglePublish" use:enhance>
									<input type="hidden" name="id" value={t.id} />
									<input type="hidden" name="published" value={String(t.published)} />
									<button type="submit" class="btn-small">
										{t.published ? 'Ascunde' : 'Publică'}
									</button>
								</form>
								<form method="post" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Sigur dorești să ștergi acest testimonial?')) e.preventDefault(); }}>
									<input type="hidden" name="id" value={t.id} />
									<button type="submit" class="btn-small btn-danger">Șterge</button>
								</form>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		<div class="new-form">
			<div class="form-card">
				<h2>Testimonial Nou</h2>
				<form method="post" action="?/create" use:enhance>
					<div class="field">
						<label for="quote">Citat</label>
						<textarea id="quote" name="quote" rows="4" placeholder="Ce a spus clientul..."></textarea>
					</div>
					<div class="field">
						<label for="authorName">Nume</label>
						<input type="text" id="authorName" name="authorName" required placeholder="Nume complet" />
					</div>
					<div class="field">
						<label for="authorTitle">Funcție / Companie</label>
						<input type="text" id="authorTitle" name="authorTitle" placeholder="Director, S.C. Exemplu" />
					</div>
					<div class="field">
						<label for="rating">Rating (1-5)</label>
						<input type="number" id="rating" name="rating" value="5" min="1" max="5" />
					</div>

					{#if form?.message}
						<p class="error" role="alert">{form.message}</p>
					{/if}

					<button type="submit" class="btn-submit">Adaugă Testimonial</button>
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

	.success {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #166534;
		padding: 14px 20px;
		margin-bottom: 24px;
		font-size: 14px;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 380px;
		gap: 32px;
	}

	.empty {
		color: var(--gray);
		font-size: 16px;
		padding: 40px 0;
	}

	.testimonial-item {
		background: white;
		border: 1px solid var(--border);
		padding: 24px;
		margin-bottom: 16px;
	}

	.quote {
		font-style: italic;
		color: var(--gray);
		line-height: 1.7;
		margin-bottom: 12px;
		font-size: 14px;
	}

	.meta {
		font-size: 14px;
		margin-bottom: 12px;
	}

	.meta strong { color: var(--primary); }
	.meta span { color: var(--gray); }
	.stars { color: var(--secondary); margin-left: 8px; }

	.item-actions {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.status { font-size: 12px; color: var(--gray); }
	.status.published { color: #16a34a; }

	.btn-small {
		padding: 4px 12px;
		font-size: 12px;
		border: 1px solid var(--border);
		background: white;
		color: var(--primary);
		cursor: pointer;
		font-family: var(--font-sans);
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

	input, textarea {
		width: 100%;
		padding: 12px 14px;
		border: 1px solid var(--border);
		font-size: 15px;
		font-family: var(--font-sans);
		color: var(--primary);
	}

	input:focus, textarea:focus { outline: none; border-color: var(--secondary); }

	.error { color: #c53030; font-size: 14px; margin-bottom: 12px; }

	.edit-actions {
		display: flex;
		gap: 8px;
		margin-top: 12px;
	}

	.btn-submit {
		width: 100%;
		padding: 14px;
		background: var(--primary);
		color: white;
		border: none;
		font-size: 15px;
		font-weight: 500;
		cursor: pointer;
		font-family: var(--font-sans);
	}

	.btn-submit:hover { background: var(--secondary); }

	@media (max-width: 968px) {
		.grid { grid-template-columns: 1fr; }
	}
</style>
