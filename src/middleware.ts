import { defineMiddleware } from 'astro:middleware';
import { getSession } from '@/utils/session';

export const onRequest = defineMiddleware(async ({ request, url, redirect, locals }, next) => {
  // Solo proteger rutas específicas (/app/* y /admin/*)
  const isProtectedPath = url.pathname.startsWith('/app') || url.pathname.startsWith('/admin');

  // CSRF Protection for API Mutations (POST, PUT, DELETE, PATCH)
  if (url.pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin') || request.headers.get('referer');
    const host = request.headers.get('host');

    // In production, enforce origin matching host to mitigate CSRF
    // We allow localhost for development or specific allowed origins if needed
    if (!origin || !host) {
      return new Response(JSON.stringify({ error: 'CSRF validation failed. Missing Origin or Referer header.' }), { status: 403 });
    }

    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host && originUrl.hostname !== 'localhost') {
         return new Response(JSON.stringify({ error: 'CSRF validation failed. Invalid Origin.' }), { status: 403 });
      }
    } catch (e) {
       return new Response(JSON.stringify({ error: 'CSRF validation failed. Malformed Origin.' }), { status: 403 });
    }
  }

  if (isProtectedPath) {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId) {
      // Redirigir a los usuarios no autenticados al inicio
      return redirect('/');
    }

    // Si es una ruta de admin, verificar que el usuario tenga el rol
    if (url.pathname.startsWith('/admin') && session.role !== 'ADMIN') {
      return redirect('/app/comunidad');
    }

    // Inyectar datos de sesión a Astro.locals para usar en las vistas
    (locals as any).userId = session.userId;
    (locals as any).role = session.role;
  }

  return next();
});