import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users Table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // ULID or UUID
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['ADMIN', 'MEMBER'] }).default('MEMBER').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Profiles Table
export const profiles = sqliteTable('profiles', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  slug: text('slug').notNull().unique(), // /@usuario
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  city: text('city'),
  country: text('country'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Invitations Table
export const invitations = sqliteTable('invitations', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  token: text('token').notNull().unique(),
  role: text('role', { enum: ['ADMIN', 'MEMBER'] }).default('MEMBER').notNull(),
  status: text('status', { enum: ['PENDING', 'USED', 'EXPIRED'] }).default('PENDING').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Posts Table (Community Feed)
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  type: text('type', { enum: ['TEXT', 'IMAGE', 'POLL'] }).default('TEXT').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Articles Table (Noticias y Comunicados)
export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => users.id),
  type: text('type', { enum: ['NEWS', 'COMMUNIQUE'] }).notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(), // HTML o Markdown
  coverImageUrl: text('cover_image_url'),
  status: text('status', { enum: ['DRAFT', 'PUBLISHED'] }).default('DRAFT').notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});