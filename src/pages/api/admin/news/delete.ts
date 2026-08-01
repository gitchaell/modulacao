import type { APIRoute } from 'astro';
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
    const id = formData.get('id')?.toString();

    if (!id) {
       return new Response(JSON.stringify({ error: 'Article ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    await newsUseCases.deleteNews(id);

    return redirect('/admin/noticias');

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
