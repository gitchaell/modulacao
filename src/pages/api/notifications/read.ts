import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { notifications } from '@/data/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();

    if (body.id) {
      // Mark specific notification as read
      await db.update(notifications)
        .set({ isRead: true })
        .where(and(
          eq(notifications.id, body.id),
          eq(notifications.userId, session.userId)
        ));
    } else if (body.markAll) {
      // Mark all as read
      await db.update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, session.userId));
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};