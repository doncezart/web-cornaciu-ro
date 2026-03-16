import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const langNames: Record<string, string> = {
	ro: 'Romanian',
	en: 'English',
	bg: 'Bulgarian'
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) error(401, 'Neautorizat');

	const apiKey = env.ANTHROPIC_API_KEY;
	if (!apiKey) error(500, 'Serviciul de traducere nu este disponibil');

	const body = await request.json();
	const { title, excerpt, content, sourceLang, targetLang } = body;

	if (!title || !content || !sourceLang || !targetLang) {
		error(400, 'Parametri lipsă');
	}

	const sourceName = langNames[sourceLang] || sourceLang;
	const targetName = langNames[targetLang] || targetLang;

	const response = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01'
		},
		body: JSON.stringify({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 8192,
			system: `You are a professional legal translator. Translate the provided law firm article from ${sourceName} to ${targetName}. Maintain the professional legal tone and appropriate legal terminology for the target language. Preserve all Markdown formatting exactly as-is. Respond with valid JSON only, no code blocks: {"title": "...", "excerpt": "...", "content": "..."}`,
			messages: [
				{
					role: 'user',
					content: `Translate this article:\n\nTitle: ${title}\n${excerpt ? `Excerpt: ${excerpt}\n` : ''}\nContent:\n${content}`
				}
			]
		})
	});

	if (!response.ok) {
		console.error('Anthropic API error:', response.status, await response.text());
		error(500, `Eroare API traducere: ${response.status}`);
	}

	const result = await response.json();
	const text = result.content?.[0]?.text;

	if (!text) error(500, 'Răspuns gol de la AI');

	try {
		const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
		const translated = JSON.parse(cleaned);
		return json({
			title: translated.title || '',
			excerpt: translated.excerpt || '',
			content: translated.content || ''
		});
	} catch {
		error(500, 'Răspunsul AI nu a putut fi procesat');
	}
};
