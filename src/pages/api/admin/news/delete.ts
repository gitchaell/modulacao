import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { articles } from '@/data/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/utils/session';

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
       return new Response(JSON.stringify({ error: 'Unauthorized. Admin privileges required.' }), { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
       return new Response(JSON.stringify({ error: 'Article ID is required' }), { status: 400 });
    }

    await db.delete(articles).where(eq(articles.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
