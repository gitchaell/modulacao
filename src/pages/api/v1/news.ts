import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { articles } from '@/data/db/schema';
import { eq, desc } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  try {
    const newsArticles = await db.select().from(articles).where(eq(articles.type, 'NEWS')).orderBy(desc(articles.publishedAt));
    return new Response(JSON.stringify(newsArticles), {
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
