import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: ':memory:',
});

export const db = drizzle(client, { schema });

import bcrypt from 'bcryptjs';

// Wait for db client to be ready, we can run migration
const statements = `
CREATE TABLE IF NOT EXISTS "articles" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"cover_image_url" text,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"published_at" integer,
	"tags" text,
	"created_at" integer,
	"updated_at" integer,
	FOREIGN KEY ("author_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS "articles_slug_unique" ON "articles" ("slug");
CREATE TABLE IF NOT EXISTS "championship_teams" (
	"championship_id" text NOT NULL,
	"team_id" text NOT NULL,
	PRIMARY KEY("championship_id", "team_id"),
	FOREIGN KEY ("championship_id") REFERENCES "championships"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "championships" (
	"id" text PRIMARY KEY NOT NULL,
	"season_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"type" text DEFAULT 'LEAGUE' NOT NULL,
	"cover_image_url" text,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON UPDATE no action ON DELETE cascade
);

CREATE UNIQUE INDEX IF NOT EXISTS "championships_slug_unique" ON "championships" ("slug");
CREATE TABLE IF NOT EXISTS "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"author_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" integer,
	FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("author_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS "event_attendances" (
	"event_id" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'ATTENDING' NOT NULL,
	"created_at" integer,
	PRIMARY KEY("event_id", "user_id"),
	FOREIGN KEY ("event_id") REFERENCES "events"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY NOT NULL,
	"group_id" text,
	"organizer_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" integer NOT NULL,
	"location" text NOT NULL,
	"map_url" text,
	"cover_image_url" text,
	"created_at" integer,
	FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS "group_members" (
	"group_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'MEMBER' NOT NULL,
	"joined_at" integer,
	FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "groups" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"cover_image_url" text,
	"created_at" integer
);

CREATE TABLE IF NOT EXISTS "invitations" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"role" text DEFAULT 'MEMBER' NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"expires_at" integer NOT NULL,
	"created_at" integer
);

CREATE UNIQUE INDEX IF NOT EXISTS "invitations_email_unique" ON "invitations" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "invitations_token_unique" ON "invitations" ("token");
CREATE TABLE IF NOT EXISTS "match_events" (
	"id" text PRIMARY KEY NOT NULL,
	"match_id" text NOT NULL,
	"team_id" text NOT NULL,
	"player_id" text NOT NULL,
	"type" text NOT NULL,
	"minute" integer,
	FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON UPDATE no action ON DELETE no action,
	FOREIGN KEY ("player_id") REFERENCES "players"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS "matches" (
	"id" text PRIMARY KEY NOT NULL,
	"championship_id" text NOT NULL,
	"home_team_id" text NOT NULL,
	"away_team_id" text NOT NULL,
	"date" integer NOT NULL,
	"location" text,
	"status" text DEFAULT 'SCHEDULED' NOT NULL,
	"home_score" integer DEFAULT 0,
	"away_score" integer DEFAULT 0,
	FOREIGN KEY ("championship_id") REFERENCES "championships"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("home_team_id") REFERENCES "teams"("id") ON UPDATE no action ON DELETE no action,
	FOREIGN KEY ("away_team_id") REFERENCES "teams"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"link_url" text,
	"is_read" integer DEFAULT false NOT NULL,
	"created_at" integer,
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "players" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"number" integer,
	"position" text,
	FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"type" text DEFAULT 'TEXT' NOT NULL,
	"created_at" integer,
	FOREIGN KEY ("author_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"price" text NOT NULL,
	"cover_image_url" text,
	"variants" text,
	"whatsapp_number" text NOT NULL,
	"created_at" integer,
	"updated_at" integer
);

CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_unique" ON "products" ("slug");
CREATE TABLE IF NOT EXISTS "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"slug" text NOT NULL,
	"bio" text,
	"avatar_url" text,
	"city" text,
	"country" text,
	"updated_at" integer,
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade
);

CREATE UNIQUE INDEX IF NOT EXISTS "profiles_slug_unique" ON "profiles" ("slug");
CREATE TABLE IF NOT EXISTS "reactions" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text,
	"comment_id" text,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"created_at" integer,
	FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action
);

CREATE TABLE IF NOT EXISTS "seasons" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_date" integer NOT NULL,
	"end_date" integer,
	"is_active" integer DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"captain_id" text,
	"created_at" integer,
	FOREIGN KEY ("captain_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS "teams_slug_unique" ON "teams" ("slug");
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'MEMBER' NOT NULL,
	"created_at" integer
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");
`.split(';').map(s => s.trim()).filter(s => s.length > 0);

for (const stmt of statements) {
  await client.execute(stmt);
}

// Check if seeded
const checkRes = await client.execute('SELECT id FROM users LIMIT 1');
if (checkRes.rows.length === 0) {
  const hash = await bcrypt.hash('password123', 10);
  await db.insert(schema.users).values([
    { id: 'admin_id_1', email: 'admin@example.com', passwordHash: hash, role: 'ADMIN' },
    { id: 'user_id_1', email: 'user1@example.com', passwordHash: hash, role: 'MEMBER' }
  ]);

  await db.insert(schema.profiles).values([
    { userId: 'admin_id_1', fullName: 'Admin User', slug: 'admin', bio: 'Administrator', avatarUrl: 'https://dummyimage.com/150x150/000/fff&text=AD', city: 'Madrid', country: 'Spain', updatedAt: new Date() },
    { userId: 'user_id_1', fullName: 'John Doe', slug: 'johndoe', bio: 'User', avatarUrl: 'https://dummyimage.com/150x150/000/fff&text=JD', city: 'Barcelona', country: 'Spain', updatedAt: new Date() }
  ]);

  await db.insert(schema.seasons).values([
    { id: 'season_id_1', name: 'Temporada 2024', startDate: new Date(), isActive: true }
  ]);

  await db.insert(schema.championships).values([
    { id: 'champ_id_1', seasonId: 'season_id_1', name: 'Liga de Verano', slug: 'liga-de-verano', type: 'LEAGUE', coverImageUrl: 'https://dummyimage.com/800x400/000/fff&text=Liga', status: 'ONGOING' }
  ]);

  await db.insert(schema.teams).values([
    { id: 'team_id_1', name: 'Los Leones', slug: 'los-leones', logoUrl: 'https://dummyimage.com/150x150/000/fff&text=LL', captainId: 'user_id_1' },
    { id: 'team_id_2', name: 'Las Águilas', slug: 'las-aguilas', logoUrl: 'https://dummyimage.com/150x150/000/fff&text=LA', captainId: 'admin_id_1' }
  ]);

  await db.insert(schema.articles).values([
    { id: 'article_id_1', authorId: 'admin_id_1', type: 'NEWS', title: 'Como o consumo de CARNE poderá auxiliar o nosso treinamento?', slug: 'como-consumo-de-carne-podera-auxiliar', excerpt: 'A alimentação com Carne Vermelha influencia nas interações con diferentes realidades.', content: 'A carne vermelha possui substâncias benéficas...', status: 'PUBLISHED', publishedAt: new Date(Date.now() - 1000000) },
    { id: 'article_id_2', authorId: 'admin_id_1', type: 'NEWS', title: 'MECANISMO DA TERRA?', slug: 'mecanismo-da-terra', excerpt: 'E se los 02 eclipses de março revelassem um segredo cósmico, guardado há milênios?', content: 'Um eclipse total ocorre quando...', status: 'PUBLISHED', publishedAt: new Date(Date.now() - 5000000) },
    { id: 'article_id_3', authorId: 'admin_id_1', type: 'NEWS', title: 'ECLIPSE LUNAR X SOLAR', slug: 'eclipse-lunar-x-solar', excerpt: 'Conheça as diferenças entre os fenômenos astronômicos espetaculares.', content: 'Eclipse Lunar e Solar, vocês conhece...', status: 'PUBLISHED', publishedAt: new Date(Date.now() - 10000000) },
  ]);
}
