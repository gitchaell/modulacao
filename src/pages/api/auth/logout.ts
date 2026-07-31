import type { APIRoute } from 'astro';
import { getSession } from '@/utils/session';

export const GET: APIRoute = async ({ request, redirect }) => {
  const response = redirect('/');
  const session = await getSession(request, response);
  session.destroy();
  return response;
};