import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) error(401, 'Neautorizat');

	const apiKey = env.ANTHROPIC_API_KEY;
	if (!apiKey) error(500, 'Cheia API Anthropic nu este configurată');

	const { title, content } = await request.json();
	if (!content) error(400, 'Conținutul este necesar');

	const response = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01'
		},
		body: JSON.stringify({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 300,
			system: 'You are a professional copywriter for a law firm website. Generate a concise, engaging excerpt/summary for the given article. The summary should be 1-2 sentences, professional in tone, and written in the same language as the article. Return only the summary text, nothing else.',
			messages: [
				{
					role: 'user',
					content: `Generate a short summary for this article:\n\nTitle: ${title || ''}\n\nContent:\n${content}`
				}
			]
		})
	});

	if (!response.ok) {
		console.error('Anthropic API error:', response.status, await response.text());
		error(500, `Eroare API: ${response.status}`);
	}

	const data = await response.json();
	const summary = data.content?.[0]?.text?.trim() ?? '';

	return json({ summary });
};
