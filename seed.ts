import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './src/data/db/schema';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const client = createClient({
  // url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  // authToken: process.env.TURSO_AUTH_TOKEN,
  url: 'file:local.db',
});
const db = drizzle(client, { schema });

async function seed() {
  const hash = await bcrypt.hash('password123', 10);

  // 1. Users
  await db.insert(schema.users).values([
    {
      id: 'admin_id_1',
      email: 'admin@example.com',
      passwordHash: hash,
      role: 'ADMIN'
    },
    {
      id: 'user_id_1',
      email: 'user1@example.com',
      passwordHash: hash,
      role: 'MEMBER'
    },
    {
      id: 'user_id_2',
      email: 'user2@example.com',
      passwordHash: hash,
      role: 'MEMBER'
    }
  ]);

  // 2. Profiles
  await db.insert(schema.profiles).values([
    {
      userId: 'admin_id_1',
      fullName: 'Admin User',
      slug: 'admin',
      bio: 'Administrator of the platform',
      avatarUrl: 'https://dummyimage.com/150x150/000/fff&text=AD',
      city: 'Madrid',
      country: 'Spain'
    },
    {
      userId: 'user_id_1',
      fullName: 'John Doe',
      slug: 'johndoe',
      bio: 'Just a regular user',
      avatarUrl: 'https://dummyimage.com/150x150/000/fff&text=JD',
      city: 'Barcelona',
      country: 'Spain'
    },
    {
      userId: 'user_id_2',
      fullName: 'Jane Smith',
      slug: 'janesmith',
      bio: 'Enthusiastic member',
      avatarUrl: 'https://dummyimage.com/150x150/000/fff&text=JS',
      city: 'Valencia',
      country: 'Spain'
    }
  ]);

  // 3. Groups
  await db.insert(schema.groups).values([
    {
      id: 'group_id_1',
      name: 'Madrid Chapter',
      type: 'CITY',
      description: 'The official group for Madrid members',
      coverImageUrl: 'https://dummyimage.com/800x400/000/fff&text=Madrid'
    },
    {
      id: 'group_id_2',
      name: 'Spain Chapter',
      type: 'COUNTRY',
      description: 'The official group for all members in Spain',
      coverImageUrl: 'https://dummyimage.com/800x400/000/fff&text=Spain'
    }
  ]);

  // 4. Group Members
  await db.insert(schema.groupMembers).values([
    { groupId: 'group_id_1', userId: 'admin_id_1', role: 'ADMIN' },
    { groupId: 'group_id_1', userId: 'user_id_1', role: 'MEMBER' },
    { groupId: 'group_id_2', userId: 'user_id_2', role: 'MEMBER' }
  ]);

  // 5. Posts & Comments
  await db.insert(schema.posts).values([
    {
      id: 'post_id_1',
      authorId: 'admin_id_1',
      content: 'Welcome to our new community platform!',
      type: 'TEXT'
    },
    {
      id: 'post_id_2',
      authorId: 'user_id_1',
      content: 'Check out this awesome photo from our last meetup.',
      imageUrl: 'https://dummyimage.com/800x600/000/fff&text=Meetup',
      type: 'IMAGE'
    }
  ]);

  await db.insert(schema.comments).values([
    {
      id: 'comment_id_1',
      postId: 'post_id_1',
      authorId: 'user_id_2',
      content: 'Thanks! So excited to be here.'
    }
  ]);

  // 6. Events & Attendances
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await db.insert(schema.events).values([
    {
      id: 'event_id_1',
      groupId: 'group_id_1',
      organizerId: 'admin_id_1',
      title: 'Summer Get-Together',
      description: 'Join us for drinks and networking!',
      date: nextMonth,
      location: 'Central Park, Madrid',
      coverImageUrl: 'https://dummyimage.com/800x400/000/fff&text=Event'
    }
  ]);

  await db.insert(schema.eventAttendances).values([
    { eventId: 'event_id_1', userId: 'admin_id_1', status: 'ATTENDING' },
    { eventId: 'event_id_1', userId: 'user_id_1', status: 'ATTENDING' }
  ]);

  // 7. Products (Catalog)
  await db.insert(schema.products).values([
    {
      id: 'product_id_1',
      name: 'Official T-Shirt',
      slug: 'official-t-shirt',
      description: 'High quality cotton t-shirt with our logo.',
      price: '$25.00',
      coverImageUrl: 'https://dummyimage.com/400x400/000/fff&text=T-Shirt',
      variants: ['S', 'M', 'L', 'XL'],
      whatsappNumber: '+1234567890'
    },
    {
      id: 'product_id_2',
      name: 'Mug',
      slug: 'mug',
      description: 'Ceramic mug for your morning coffee.',
      price: '$15.00',
      coverImageUrl: 'https://dummyimage.com/400x400/000/fff&text=Mug',
      variants: ['Black', 'White'],
      whatsappNumber: '+1234567890'
    }
  ]);

  // 8. Notifications
  await db.insert(schema.notifications).values([
    {
      id: 'notif_id_1',
      userId: 'admin_id_1',
      type: 'SYSTEM',
      message: 'Your profile has been updated.',
      isRead: false
    }
  ]);

  // 9. Sports Module (Seasons, Championships, Teams, Players, Matches)
  await db.insert(schema.seasons).values([
    {
      id: 'season_id_1',
      name: 'Temporada 2024',
      startDate: new Date(),
      isActive: true
    }
  ]);

  await db.insert(schema.championships).values([
    {
      id: 'champ_id_1',
      seasonId: 'season_id_1',
      name: 'Liga de Verano',
      slug: 'liga-de-verano',
      type: 'LEAGUE',
      coverImageUrl: 'https://dummyimage.com/800x400/000/fff&text=Liga',
      status: 'ONGOING'
    }
  ]);

  await db.insert(schema.teams).values([
    {
      id: 'team_id_1',
      name: 'Los Leones',
      slug: 'los-leones',
      logoUrl: 'https://dummyimage.com/150x150/000/fff&text=LL',
      captainId: 'user_id_1'
    },
    {
      id: 'team_id_2',
      name: 'Las Águilas',
      slug: 'las-aguilas',
      logoUrl: 'https://dummyimage.com/150x150/000/fff&text=LA',
      captainId: 'user_id_2'
    }
  ]);

  await db.insert(schema.championshipTeams).values([
    { championshipId: 'champ_id_1', teamId: 'team_id_1' },
    { championshipId: 'champ_id_1', teamId: 'team_id_2' }
  ]);

  await db.insert(schema.players).values([
    { id: 'player_id_1', teamId: 'team_id_1', userId: 'user_id_1', name: 'John Doe', number: 10, position: 'Forward' },
    { id: 'player_id_2', teamId: 'team_id_2', userId: 'user_id_2', name: 'Jane Smith', number: 1, position: 'Goalkeeper' }
  ]);

  await db.insert(schema.matches).values([
    {
      id: 'match_id_1',
      championshipId: 'champ_id_1',
      homeTeamId: 'team_id_1',
      awayTeamId: 'team_id_2',
      date: nextMonth,
      status: 'SCHEDULED',
      location: 'Estadio Principal'
    }
  ]);

  // 10. Articles (News & Communiques)
  await db.insert(schema.articles).values([
    {
      id: 'article_id_1',
      authorId: 'admin_id_1',
      type: 'NEWS',
      title: 'Platform Launch!',
      slug: 'platform-launch',
      excerpt: 'We are officially live.',
      content: '<p>Welcome to our new community platform. We are thrilled to have you here.</p>',
      coverImageUrl: 'https://dummyimage.com/800x400/000/fff&text=Launch',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      tags: ['launch', 'news']
    }
  ]);

  console.log('Seeded comprehensive mock data across all entities!');
}

seed().catch(console.error);
