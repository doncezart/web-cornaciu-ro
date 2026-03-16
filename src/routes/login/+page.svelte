<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/components/Seo.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<Seo title="Autentificare | Cabinet Avocat Cornaciu" description="Autentificare admin" />

<section class="login-page">
	<div class="login-card">
		<div class="login-header">
			<h1>Autentificare</h1>
			<p>Introdu datele de autentificare pentru panoul de administrare.</p>
		</div>

		<form method="post" action="?/login" use:enhance={() => { loading = true; return async ({ update }) => { loading = false; await update(); }; }}>
			<div class="field">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" required autocomplete="email" disabled={loading} />
			</div>
			<div class="field">
				<label for="password">Parolă</label>
				<input type="password" id="password" name="password" required autocomplete="current-password" disabled={loading} />
			</div>

			{#if form?.message}
				<p class="error" role="alert">{form.message}</p>
			{/if}

			<button type="submit" class="cta-primary" disabled={loading}>
				{loading ? 'Se autentifică...' : 'Autentificare'}
			</button>
		</form>

		<a href="/" class="back-link">← Înapoi la site</a>
	</div>
</section>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 120px 20px 40px;
		background: var(--light);
	}

	.login-card {
		width: 100%;
		max-width: 460px;
		background: var(--white);
		border: 1px solid var(--border);
		padding: 56px;
	}

	.login-header {
		margin-bottom: 40px;
	}

	h1 {
		font-family: var(--font-serif);
		font-size: 36px;
		font-weight: 400;
		color: var(--primary);
		margin-bottom: 12px;
	}

	.login-header p {
		color: var(--gray);
		font-size: 15px;
		font-weight: 300;
	}

	.field {
		margin-bottom: 24px;
	}

	label {
		display: block;
		font-size: 13px;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: var(--gray);
		font-weight: 600;
		margin-bottom: 8px;
	}

	input {
		width: 100%;
		padding: 14px 16px;
		border: 1px solid var(--border);
		font-size: 16px;
		font-family: var(--font-sans);
		color: var(--primary);
		background: var(--white);
		transition: border-color 0.3s ease;
	}

	input:focus {
		outline: none;
		border-color: var(--secondary);
	}

	.error {
		color: #c53030;
		font-size: 14px;
		margin-bottom: 16px;
	}

	button {
		width: 100%;
		margin-top: 8px;
	}

	button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.back-link {
		display: block;
		text-align: center;
		margin-top: 32px;
		color: var(--gray);
		font-size: 14px;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.back-link:hover {
		color: var(--primary);
	}
</style>
