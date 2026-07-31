import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { articles } from '@/data/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
       return new Response(JSON.stringify({ error: 'Unauthorized. Admin privileges required.' }), { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const type = formData.get('type')?.toString() as 'NEWS' | 'COMMUNIQUE';
    const status = formData.get('status')?.toString() as 'DRAFT' | 'PUBLISHED';

    if (!id || !title || !content || !type || !status) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    await db.update(articles)
      .set({
        type,
        title,
        content,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        updatedAt: new Date()
      })
      .where(eq(articles.id, id));

    return redirect('/admin/noticias');
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
