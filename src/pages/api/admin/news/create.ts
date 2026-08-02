import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { getSession } from '@/utils/session';
import { NewsUseCases } from '@/application/use-cases/news';
import { TursoNewsRepository } from '@/infrastructure/repositories/tursoNewsRepository';

const newsUseCases = new NewsUseCases(new TursoNewsRepository());

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
       return new Response(JSON.stringify({ error: 'Unauthorized. Admin privileges required.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const formData = await request.formData();
    const title = formData.get('title')?.toString();
    const content = formData.get('content')?.toString();
    const type = formData.get('type')?.toString() as 'NEWS' | 'COMMUNIQUE';

    if (!title || !content || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (title.length < 5) {
      return new Response(JSON.stringify({ error: 'El título debe tener al menos 5 caracteres' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + crypto.randomBytes(4).toString('hex');

    await newsUseCases.createNews({
      id: crypto.randomUUID(),
      authorId: session.userId,
      type,
      title,
      slug,
      excerpt: null,
      content,
      status: 'DRAFT',
      publishedAt: null,
      tags: null,
      coverImageUrl: null
    });

    return redirect('/admin/noticias');
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
