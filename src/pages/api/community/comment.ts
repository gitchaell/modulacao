import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { comments, users } from '@/data/db/schema';
import crypto from 'node:crypto';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const postId = formData.get('postId')?.toString();
    const content = formData.get('content')?.toString();

    if (!postId || !content || content.trim() === '') {
      return new Response('Missing required fields', { status: 400 });
    }

    await db.insert(comments).values({
      id: crypto.randomUUID(),
      postId,
      authorId: session.userId,
      content
    });

    return redirect('/app/comunidad'); // Or back to a specific post page
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};