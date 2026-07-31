import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { eventAttendances } from '@/data/db/schema';
import { and, eq } from 'drizzle-orm';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const eventId = formData.get('eventId')?.toString();
    const action = formData.get('action')?.toString(); // 'JOIN' or 'LEAVE'

    if (!eventId || !action) {
      return new Response('Missing required fields', { status: 400 });
    }

    if (action === 'JOIN') {
      // Basic implementation without capacity limits for Phase 4.
      // Waitlist logic would be added here if checking capacity limits.
      await db.insert(eventAttendances)
        .values({
          eventId,
          userId: session.userId,
          status: 'ATTENDING'
        })
        .onConflictDoNothing(); // Prevent multiple attendances
    } else if (action === 'LEAVE') {
      await db.delete(eventAttendances)
        .where(
          and(
            eq(eventAttendances.eventId, eventId),
            eq(eventAttendances.userId, session.userId)
          )
        );
    }

    return redirect(`/app/eventos/${eventId}`);
  } catch (error: any) {
    console.error('Error updating attendance:', error);
    return new Response(error.message, { status: 500 });
  }
};