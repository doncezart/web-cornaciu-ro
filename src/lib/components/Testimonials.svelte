<script lang="ts">
	interface Testimonial {
		id: number;
		quote: string | null;
		authorName: string;
		authorTitle: string | null;
		rating: number | null;
		published?: boolean | null;
		createdAt?: Date | null;
	}

	interface Props {
		testimonials: Testimonial[];
		locale: import('$lib/i18n').Locale;
		t: (key: string, params?: Record<string, string | number>) => string;
	}

	import { reveal } from '$lib/actions/reveal';

	let { testimonials, locale, t }: Props = $props();
</script>

<section class="testimonials">
	<div class="container-narrow">
		<div class="section-header animate-in" use:reveal>
			<span class="section-label">{t('testimonials.label')}</span>
			<h2 class="section-title">{t('testimonials.title')}</h2>
			<p class="section-description">{t('testimonials.description')}</p>
		</div>
		<div class="testimonials-grid" use:reveal>
			{#each testimonials as t}
				<div class="testimonial-card animate-in">
					{#if t.quote}
						<p class="testimonial-quote">"{t.quote}"</p>
					{/if}
					<div class="testimonial-author">
						<span class="testimonial-name">{t.authorName}</span>
						{#if t.authorTitle}
							<span class="testimonial-title">{t.authorTitle}</span>
						{/if}
						<div class="testimonial-rating">
							{#each Array(t.rating ?? 5) as _}★{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.testimonials {
		padding: 140px 0;
		background: var(--white);
	}

	.testimonials-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 48px;
		margin-top: 80px;
	}

	.testimonial-card {
		padding: 48px;
		border: 1px solid var(--border);
		background: var(--white);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.testimonial-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08);
	}

	.testimonial-quote {
		font-size: 16px;
		line-height: 1.8;
		color: var(--gray);
		margin-bottom: 32px;
		font-weight: 300;
		font-style: italic;
	}

	.testimonial-author {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.testimonial-name {
		font-weight: 600;
		color: var(--primary);
		font-size: 15px;
	}

	.testimonial-title {
		font-size: 14px;
		color: var(--gray);
		font-weight: 300;
	}

	.testimonial-rating {
		color: var(--secondary);
		font-size: 14px;
		margin-top: 8px;
	}

	@media (max-width: 968px) {
		.testimonials { padding: 80px 0; }
		.testimonials-grid { grid-template-columns: 1fr; }
	}
</style>
