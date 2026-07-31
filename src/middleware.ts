import { defineMiddleware } from 'astro:middleware';
import { getSession } from '@/utils/session';

export const onRequest = defineMiddleware(async ({ request, url, redirect, locals }, next) => {
  // Solo proteger rutas específicas (/app/* y /admin/*)
  const isProtectedPath = url.pathname.startsWith('/app') || url.pathname.startsWith('/admin');

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