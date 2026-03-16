import postgres from 'postgres';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/lib/server/db/schema';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://root:mysecretpassword@localhost:5433/local';
const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

const auth = betterAuth({
	baseURL: 'http://localhost:6969',
	secret: '8e30d553-c00e-4c70-9819-cdc7e32200ef',
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true }
});

async function seed() {
	const res = await auth.api.signUpEmail({
		body: {
			name: 'Admin',
			email: 'admin@cornaciu.ro',
			password: 'admin123'
		}
	});
	console.log('Admin user created:', res.user.email);
	await client.end();
}

seed().catch((e) => {
	console.error(e);
	process.exit(1);
});
