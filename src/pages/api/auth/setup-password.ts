import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { users, profiles, invitations } from '@/data/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const token = formData.get('token')?.toString();
    const password = formData.get('password')?.toString();
    const confirmPassword = formData.get('confirmPassword')?.toString();

    if (!token || !password || !confirmPassword) {
      return new Response('Missing fields', { status: 400 });
    }

    if (password !== confirmPassword) {
      return new Response('Passwords do not match', { status: 400 });
    }

    const [invitation] = await db.select().from(invitations).where(eq(invitations.token, token));

    if (!invitation || invitation.status !== 'PENDING' || new Date(invitation.expiresAt) < new Date()) {
      return new Response('Invalid or expired token', { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      email: invitation.email,
      passwordHash,
      role: invitation.role as 'ADMIN' | 'MEMBER'
    });

    await db.insert(profiles).values({
      userId,
      fullName: invitation.email.split('@')[0],
      slug: invitation.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + crypto.randomBytes(2).toString('hex'),
    });

    await db.update(invitations)
      .set({ status: 'USED' })
      .where(eq(invitations.id, invitation.id));

    // Create session
    const response = redirect('/app/comunidad');
    const session = await getIronSession<{ userId?: string; role?: string }>(request, response, {
      password: import.meta.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
      cookieName: 'modulacao_session',
      cookieOptions: {
        secure: import.meta.env.PROD,
      },
    });

    session.userId = userId;
    session.role = invitation.role;
    await session.save();

    return response;

  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};