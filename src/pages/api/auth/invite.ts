import type { APIRoute } from 'astro';
import { createInvitation } from '@/domain/auth/invitation';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Unauthorized. Admin privileges required.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json();

    if (!body.email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const invitation = await createInvitation(body.email, body.role || 'MEMBER');

    return new Response(JSON.stringify({
      success: true,
      message: 'Invitation generated successfully',
      inviteUrl: `/invitacion/${invitation.token}`
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};