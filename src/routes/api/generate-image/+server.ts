import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { uploadBufferToR2 } from '$lib/server/r2';
import type { RequestHandler } from './$types';

const STYLE_PREFIX = `Luxury minimalist editorial illustration for a prestigious law firm website. Warm tones of taupe (#6B5A3E), cream (#F8F6F3), and muted gold. Elegant, sophisticated, clean composition with generous negative space. Soft natural lighting, slightly desaturated warm color grading. Professional and authoritative mood. No text or watermarks.`;

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) error(401, 'Neautorizat');

	const apiKey = env.OPENAI_API_KEY;
	if (!apiKey) error(500, 'Serviciul de generare imagini nu este disponibil');

	const { title, content } = await request.json();
	if (!title) error(400, 'Titlul este necesar');

	const subject = content
		? `Article topic: "${title}". ${content.slice(0, 300)}`
		: `Article topic: "${title}"`;

	const prompt = `${STYLE_PREFIX}\n\nSubject: Create a fitting cover image for a legal article. ${subject}`;

	const response = await fetch('https://api.openai.com/v1/images/generations', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: 'gpt-image-1',
			prompt,
			n: 1,
			size: '1536x1024',
			quality: 'medium'
		})
	});

	if (!response.ok) {
		const errText = await response.text();
		console.error('OpenAI Image API error:', response.status, errText);
		error(500, `Eroare API generare imagine: ${response.status}`);
	}

	const data = await response.json();
	const b64 = data.data?.[0]?.b64_json;

	if (!b64) {
		error(500, 'Nu s-a primit imaginea de la API');
	}

	const imageBuffer = Buffer.from(b64, 'base64');
	const url = await uploadBufferToR2(imageBuffer, 'image/png', 'png', 'covers');

	return json({ url });
};
