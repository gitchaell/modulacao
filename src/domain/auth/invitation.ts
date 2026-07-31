import { db } from '@/data/db/db';
import { invitations } from '@/data/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';

export async function createInvitation(email: string, role: 'ADMIN' | 'MEMBER' = 'MEMBER') {
  const token = crypto.randomBytes(32).toString('hex');
  // Expires in 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const [invitation] = await db.insert(invitations).values({
    id: crypto.randomUUID(),
    email,
    token,
    role,
    expiresAt,
  }).returning();

  return invitation;
}

export async function validateToken(token: string) {
  const [invitation] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.token, token));

  if (!invitation) return null;
  if (invitation.status !== 'PENDING') return null;
  if (new Date(invitation.expiresAt) < new Date()) return null;

  return invitation;
}