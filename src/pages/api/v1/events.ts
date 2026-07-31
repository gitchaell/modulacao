import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { events } from '@/data/db/schema';
import { desc } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  try {
    const allEvents = await db.select().from(events).orderBy(desc(events.date));
    return new Response(JSON.stringify(allEvents), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
