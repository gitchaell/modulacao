import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { products } from '@/data/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/utils/session';

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
       return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
       return new Response(JSON.stringify({ error: 'Product ID is required' }), { status: 400 });
    }

    await db.delete(products).where(eq(products.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
