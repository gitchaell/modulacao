import type { APIRoute } from 'astro';
import { createInvitation } from '@/domain/auth/invitation';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Basic protection to prevent unauthorized admin creation.
    // In Phase 2 this should be replaced with a real Session check middleware.
    const authHeader = request.headers.get('Authorization');
    const adminSecret = import.meta.env.ADMIN_SECRET || 'dev-secret';

    if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();

    if (!body.email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    const invitation = await createInvitation(body.email, body.role || 'MEMBER');

    return new Response(JSON.stringify({
      success: true,
      message: 'Invitation generated successfully',
      inviteUrl: `/invitacion/${invitation.token}`
    }), { status: 201 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};