import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { articles } from '@/data/db/schema';
import crypto from 'node:crypto';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
       return new Response(JSON.stringify({ error: 'Unauthorized. Admin privileges required.' }), { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const type = formData.get('type')?.toString() as 'NEWS' | 'COMMUNIQUE';

    if (!title || !content || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Basic slug generation
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + crypto.randomBytes(4).toString('hex');

    await db.insert(articles).values({
      id: crypto.randomUUID(),
      authorId: session.userId,
      type,
      title,
      slug,
      content,
      status: 'DRAFT', // Creates as draft by default
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return redirect('/admin/noticias');
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
