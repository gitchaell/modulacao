import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { users, profiles, invitations } from '@/data/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

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

    // 1. Validate Token
    const [invitation] = await db.select().from(invitations).where(eq(invitations.token, token));

    if (!invitation || invitation.status !== 'PENDING' || new Date(invitation.expiresAt) < new Date()) {
      return new Response('Invalid or expired token', { status: 400 });
    }

    // 2. Hash Password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    // 3. Create User, Profile and invalidate token in a pseudo-transaction
    // Turso/SQLite supports transactions, but using sequential for simplicity in Phase 1
    await db.insert(users).values({
      id: userId,
      email: invitation.email,
      passwordHash,
      role: invitation.role as 'ADMIN' | 'MEMBER'
    });

    await db.insert(profiles).values({
      userId,
      fullName: invitation.email.split('@')[0], // Default name
      slug: invitation.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + crypto.randomBytes(2).toString('hex'), // Unique slug
    });

    await db.update(invitations)
      .set({ status: 'USED' })
      .where(eq(invitations.id, invitation.id));

    // Redirect to login or app directly
    return redirect('/app/comunidad');

  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};