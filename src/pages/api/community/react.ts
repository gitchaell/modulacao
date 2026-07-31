import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { reactions } from '@/data/db/schema';
import crypto from 'node:crypto';
import { getSession } from '@/utils/session';
import { eq, and } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { postId } = await request.json();

    if (!postId) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Toggle reaction logic
    const existingReaction = await db
        .select()
        .from(reactions)
        .where(and(eq(reactions.postId, postId), eq(reactions.userId, session.userId)))
        .limit(1);

    if (existingReaction.length > 0) {
        // Remove reaction
        await db.delete(reactions).where(eq(reactions.id, existingReaction[0].id));
        return new Response(JSON.stringify({ success: true, action: 'removed' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
        // Add reaction
        await db.insert(reactions).values({
          id: crypto.randomUUID(),
          postId,
          userId: session.userId,
          type: 'like'
        });
        return new Response(JSON.stringify({ success: true, action: 'added' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (error: any) {
    console.error('Error in reaction:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
