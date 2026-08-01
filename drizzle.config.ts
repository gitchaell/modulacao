import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/data/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    // url: process.env.TURSO_DATABASE_URL || 'file:local.db',
    // authToken: process.env.TURSO_AUTH_TOKEN,
    url: 'file:local.db',
  },
});