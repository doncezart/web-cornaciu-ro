<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutServerData } from './$types';

	let { data, children }: { data: LayoutServerData; children: any } = $props();
	let mobileOpen = $state(false);

	function isActive(href: string): boolean {
		const path = page.url.pathname;
		if (href === '/admin') return path === '/admin';
		return path.startsWith(href);
	}
</script>

<div class="admin-layout">
	<button class="mobile-toggle" aria-label="Meniu admin" onclick={() => mobileOpen = !mobileOpen}>
		{mobileOpen ? '✕' : '☰'}
	</button>
	<aside class="admin-sidebar" class:open={mobileOpen}>
		<a href="/" class="admin-logo">Cornaciu</a>
		<nav class="admin-nav">
			<a href="/admin" class:active={isActive('/admin')} onclick={() => mobileOpen = false}>Dashboard</a>
			<a href="/admin/articole" class:active={isActive('/admin/articole')} onclick={() => mobileOpen = false}>Articole</a>
			<a href="/admin/categorii" class:active={isActive('/admin/categorii')} onclick={() => mobileOpen = false}>Categorii</a>
			<a href="/admin/testimoniale" class:active={isActive('/admin/testimoniale')} onclick={() => mobileOpen = false}>Testimoniale</a>
		</nav>
		<div class="admin-user">
			<span>{data.user.name ?? data.user.email}</span>
			<form method="post" action="/admin?/signOut">
				<button type="submit">Deconectare</button>
			</form>
		</div>
	</aside>
	{#if mobileOpen}
		<button class="sidebar-overlay" aria-label="Închide meniu" onclick={() => mobileOpen = false}></button>
	{/if}
	<div class="admin-main">
		{@render children()}
	</div>
</div>

<style>
	.admin-layout {
		min-height: 100vh;
	}

	.admin-sidebar {
		background: var(--primary);
		color: var(--white);
		padding: 32px 24px;
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 260px;
		z-index: 100;
	}

	.admin-logo {
		font-family: var(--font-serif);
		font-size: 24px;
		font-weight: 600;
		color: var(--white);
		text-decoration: none;
		margin-bottom: 40px;
	}

	.admin-nav {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.admin-nav a {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		padding: 12px 16px;
		font-size: 15px;
		transition: all 0.2s ease;
		font-weight: 400;
	}

	.admin-nav a:hover {
		color: var(--white);
		background: rgba(255, 255, 255, 0.1);
	}

	.admin-nav a.active {
		color: var(--white);
		background: rgba(255, 255, 255, 0.15);
		font-weight: 500;
	}

	.admin-user {
		padding-top: 24px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.admin-user span {
		display: block;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 12px;
	}

	.admin-user button {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: rgba(255, 255, 255, 0.7);
		padding: 8px 16px;
		font-size: 13px;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: all 0.2s ease;
		width: 100%;
	}

	.admin-user button:hover {
		border-color: var(--white);
		color: var(--white);
	}

	.admin-main {
		padding: 40px;
		margin-left: 260px;
		background: #f9f9f9;
		min-height: 100vh;
	}

	.mobile-toggle {
		display: none;
		position: fixed;
		top: 12px;
		left: 12px;
		z-index: 200;
		width: 40px;
		height: 40px;
		border: none;
		background: var(--primary);
		color: white;
		font-size: 20px;
		cursor: pointer;
		border-radius: 6px;
		align-items: center;
		justify-content: center;
	}

	.sidebar-overlay {
		display: none;
	}

	@media (max-width: 968px) {
		.mobile-toggle {
			display: flex;
		}

		.admin-sidebar {
			position: fixed;
			width: 260px;
			transform: translateX(-100%);
			transition: transform 0.3s ease;
		}

		.admin-sidebar.open {
			transform: translateX(0);
		}

		.sidebar-overlay {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 99;
			background: rgba(0, 0, 0, 0.4);
			border: none;
			cursor: pointer;
		}

		.admin-main {
			margin-left: 0;
			padding: 60px 16px 24px;
		}
	}
</style>
