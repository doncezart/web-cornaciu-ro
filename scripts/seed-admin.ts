import postgres from 'postgres';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/lib/server/db/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error('DATABASE_URL environment variable is required');
	process.exit(1);
}
const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

const auth = betterAuth({
	baseURL: process.env.ORIGIN || 'http://localhost:6969',
	secret: process.env.BETTER_AUTH_SECRET || 'dev-only-secret-do-not-use-in-production',
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true }
});

async function seed() {
	const email = process.env.ADMIN_EMAIL || 'admin@cornaciu.ro';
	const password = process.env.ADMIN_PASSWORD;
	if (!password) {
		console.error('ADMIN_PASSWORD environment variable is required. Use a strong password.');
		process.exit(1);
	}
	const res = await auth.api.signUpEmail({
		body: {
			name: 'Admin',
			email,
			password
		}
	});
	console.log('Admin user created:', res.user.email);
	await client.end();
}

seed().catch((e) => {
	console.error(e);
	process.exit(1);
});
