import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { posts, users } from '@/data/db/schema';
import { uploadImage } from '@/data/storage/blob';
import crypto from 'node:crypto';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const formData = await request.formData();
    const content = formData.get('content')?.toString();
    const imageFile = formData.get('image') as File | null;

    if (!content || content.trim() === '') {
      return new Response(JSON.stringify({ error: 'Content is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    let imageUrl = null;
    let type: 'TEXT' | 'IMAGE' = 'TEXT';

    if (imageFile && imageFile.size > 0) {
      const filename = `${crypto.randomUUID()}-${imageFile.name}`;
      // Note: Requires VERCEL_TOKEN and VERCEL_BLOB_READ_WRITE_TOKEN in env for real upload
      imageUrl = await uploadImage(imageFile, filename);
      type = 'IMAGE';
    }

    await db.insert(posts).values({
      id: crypto.randomUUID(),
      authorId: session.userId,
      content,
      imageUrl,
      type
    });

    return redirect('/app/comunidad');
  } catch (error: any) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};