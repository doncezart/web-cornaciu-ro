import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

function getR2Client() {
	if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
		return null;
	}

	return new S3Client({
		region: 'auto',
		endpoint: `https://${env.R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: env.R2_ACCESS_KEY_ID,
			secretAccessKey: env.R2_SECRET_ACCESS_KEY
		}
	});
}

export async function uploadToR2(
	file: File,
	folder: string = 'articles'
): Promise<string> {
	const client = getR2Client();
	const bucket = env.R2_BUCKET_NAME;

	if (!client || !bucket) {
		throw new Error('R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL in .env');
	}

	const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
	const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
	const buffer = Buffer.from(await file.arrayBuffer());

	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: buffer,
			ContentType: file.type
		})
	);

	const publicUrl = env.R2_PUBLIC_URL;
	return `${publicUrl}/${key}`;
}

export async function uploadBufferToR2(
	buffer: Buffer,
	contentType: string,
	ext: string,
	folder: string = 'articles'
): Promise<string> {
	const client = getR2Client();
	const bucket = env.R2_BUCKET_NAME;

	if (!client || !bucket) {
		throw new Error('R2 is not configured.');
	}

	const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: buffer,
			ContentType: contentType
		})
	);

	const publicUrl = env.R2_PUBLIC_URL;
	return `${publicUrl}/${key}`;
}
