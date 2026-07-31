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

// Notifications Table
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // e.g., 'SYSTEM', 'SOCIAL', 'EVENT'
  message: text('message').notNull(),
  linkUrl: text('link_url'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// --- PHASE 6: SPORTS MODULE ---

export const seasons = sqliteTable('seasons', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // e.g., "Temporada 2024"
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }),
  isActive: integer('is_active', { mode: 'boolean' }).default(false).notNull(),
});

export const championships = sqliteTable('championships', {
  id: text('id').primaryKey(),
  seasonId: text('season_id').notNull().references(() => seasons.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type', { enum: ['LEAGUE', 'CUP'] }).default('LEAGUE').notNull(),
  coverImageUrl: text('cover_image_url'),
  status: text('status', { enum: ['DRAFT', 'ONGOING', 'FINISHED'] }).default('DRAFT').notNull(),
});

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
  captainId: text('captain_id').references(() => users.id), // Link to user profile
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const championshipTeams = sqliteTable('championship_teams', {
  championshipId: text('championship_id').notNull().references(() => championships.id, { onDelete: 'cascade' }),
  teamId: text('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.championshipId, t.teamId] }),
}));

export const players = sqliteTable('players', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id), // If the player is a registered user
  name: text('name').notNull(), // Display name
  number: integer('number'),
  position: text('position'),
});

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  championshipId: text('championship_id').notNull().references(() => championships.id, { onDelete: 'cascade' }),
  homeTeamId: text('home_team_id').notNull().references(() => teams.id),
  awayTeamId: text('away_team_id').notNull().references(() => teams.id),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  location: text('location'),
  status: text('status', { enum: ['SCHEDULED', 'PLAYING', 'FINISHED', 'CANCELLED'] }).default('SCHEDULED').notNull(),
  homeScore: integer('home_score').default(0),
  awayScore: integer('away_score').default(0),
});

export const matchEvents = sqliteTable('match_events', {
  id: text('id').primaryKey(),
  matchId: text('match_id').notNull().references(() => matches.id, { onDelete: 'cascade' }),
  teamId: text('team_id').notNull().references(() => teams.id),
  playerId: text('player_id').notNull().references(() => players.id),
  type: text('type', { enum: ['GOAL', 'YELLOW_CARD', 'RED_CARD', 'OWN_GOAL'] }).notNull(),
  minute: integer('minute'),
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