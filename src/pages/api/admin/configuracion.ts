import type { APIRoute } from 'astro';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getSession(request, new Response());

    if (!session.userId || session.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Unauthorized. Admin privileges required.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();

    // Minimal validation to mock the update of global tenant configuration via DB eventually
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();

    if (!name || name.trim().length < 3) {
      return new Response(JSON.stringify({ error: 'El nombre debe tener al menos 3 caracteres.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
       return new Response(JSON.stringify({ error: 'El correo electrónico no es válido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Global configuration theoretically updated to Name: ${name}, Email: ${email}`);

    return new Response(JSON.stringify({ success: true, message: 'Configuración guardada correctamente.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
