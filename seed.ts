import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './src/data/db/schema';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client, { schema });

async function seed() {
  const hash = await bcrypt.hash('password123', 10);
  await db.insert(schema.users).values({
    id: 'admin_id_1',
    email: 'admin@example.com',
    passwordHash: hash,
    role: 'ADMIN'
  });
  await db.insert(schema.profiles).values({
    userId: 'admin_id_1',
    fullName: 'Admin User',
    slug: 'admin',
  });
  console.log('Seeded admin user (admin@example.com / password123)');
}

seed().catch(console.error);
