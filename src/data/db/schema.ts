import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

// Users Table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // ULID or UUID
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['ADMIN', 'MEMBER'] }).default('MEMBER').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
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
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Invitations Table
export const invitations = sqliteTable('invitations', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  token: text('token').notNull().unique(),
  role: text('role', { enum: ['ADMIN', 'MEMBER'] }).default('MEMBER').notNull(),
  status: text('status', { enum: ['PENDING', 'USED', 'EXPIRED'] }).default('PENDING').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Posts Table (Community Feed)
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  type: text('type', { enum: ['TEXT', 'IMAGE', 'POLL'] }).default('TEXT').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Comments Table
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Reactions Table
export const reactions = sqliteTable('reactions', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(), // e.g., 'like', 'fire', 'gold'
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Groups Table
export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: ['COUNTRY', 'CITY'] }).notNull(),
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Group Members Table
export const groupMembers = sqliteTable('group_members', {
  groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['ADMIN', 'MEMBER'] }).default('MEMBER').notNull(),
  joinedAt: integer('joined_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Events Table
export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  groupId: text('group_id').references(() => groups.id, { onDelete: 'cascade' }),
  organizerId: text('organizer_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  location: text('location').notNull(),
  mapUrl: text('map_url'),
  coverImageUrl: text('cover_image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Event Attendances Table
export const eventAttendances = sqliteTable('event_attendances', {
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['ATTENDING', 'WAITLIST'] }).default('ATTENDING').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.userId] }),
}));

// Catalog Products Table
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: text('price').notNull(), // Formatted text for flexibility (e.g., "$15.00", "Consultar")
  coverImageUrl: text('cover_image_url'),
  variants: text('variants', { mode: 'json' }).$type<string[]>(), // e.g., ["S", "M", "L"] or ["Negro", "Dorado"]
  whatsappNumber: text('whatsapp_number').notNull(), // The number to contact
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
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
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});