import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { events } from '@/data/db/schema';
import crypto from 'node:crypto';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
       return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const location = formData.get('location')?.toString();
    const date = formData.get('date')?.toString();

    if (!title || !description || !location || !date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    await db.insert(events).values({
      id: crypto.randomUUID(),
      organizerId: session.userId,
      title,
      description,
      location,
      date: new Date(date)
    });

    return redirect('/admin/eventos');
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
