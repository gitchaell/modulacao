import type { APIRoute } from 'astro';
import { getSession } from '@/utils/session';
import { EventUseCases } from '@/application/use-cases/events';
import { TursoEventRepository } from '@/infrastructure/repositories/tursoEventRepository';

const eventUseCases = new EventUseCases(new TursoEventRepository());

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
       return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();

    if (!id) {
       return new Response(JSON.stringify({ error: 'Event ID is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    await eventUseCases.deleteEvent(id);

    return redirect('/admin/eventos');

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
