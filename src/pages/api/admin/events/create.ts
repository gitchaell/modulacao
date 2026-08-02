import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
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
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const location = formData.get('location')?.toString();
    const date = formData.get('date')?.toString();

    if (!title || !description || !location || !date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (title.length < 5) {
      return new Response(JSON.stringify({ error: 'El título debe tener al menos 5 caracteres' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    await eventUseCases.createEvent({
      id: crypto.randomUUID(),
      organizerId: session.userId,
      groupId: null,
      title,
      description,
      location,
      date: new Date(date),
      mapUrl: null,
      coverImageUrl: null
    });

    return redirect('/admin/eventos');
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
