import { json, error } from '@sveltejs/kit';
import { uploadToR2 } from '$lib/server/r2';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	if (!event.locals.user) {
		error(401, 'Neautorizat');
	}

	// CSRF protection: require and verify the request origin
	const origin = event.request.headers.get('origin');
	if (!origin || origin !== event.url.origin) {
		error(403, 'Cerere cross-origin refuzată');
	}

	const formData = await event.request.formData();
	const file = formData.get('file');

	if (!file || !(file instanceof File)) {
		error(400, 'Niciun fișier trimis');
	}

	const maxSize = 10 * 1024 * 1024; // 10MB
	if (file.size > maxSize) {
		error(400, 'Fișierul depășește 10MB');
	}

	const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
	if (!allowedTypes.includes(file.type)) {
		error(400, 'Tip de fișier neacceptat. Acceptăm: JPEG, PNG, WebP, GIF, AVIF');
	}

	// Validate file magic bytes
	const fileBuffer = await file.arrayBuffer();
	const buffer = new Uint8Array(fileBuffer);
	const hex = (offset: number, len: number) =>
		Array.from(buffer.slice(offset, offset + len))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');

	const validMagic =
		hex(0, 3) === 'ffd8ff' || // JPEG
		hex(0, 4) === '89504e47' || // PNG
		(hex(0, 4) === '52494646' && hex(8, 4) === '57454250') || // WebP
		hex(0, 4) === '47494638' || // GIF
		(buffer.length >= 12 && hex(4, 4) === '66747970' && hex(8, 4) === '61766966'); // AVIF (ftyp + avif)

	if (!validMagic) {
		error(400, 'Fișierul nu corespunde tipului declarat');
	}

	// Reconstruct file since arrayBuffer was consumed
	const uploadFile = new File([fileBuffer], file.name, { type: file.type });

	try {
		const url = await uploadToR2(uploadFile);
		return json({ url });
	} catch (err) {
		console.error('R2 upload failed:', err);
		error(500, 'Eroare la încărcarea fișierului');
	}
};
