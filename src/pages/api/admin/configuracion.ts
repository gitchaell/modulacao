import type { APIRoute } from 'astro';
import { getSession } from '@/utils/session';
import { db } from '@/data/db/db';
import { tenantConfig } from '@/data/db/schema';
import { eq } from 'drizzle-orm';

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

    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const instagram = formData.get('instagram')?.toString() || null;
    const facebook = formData.get('facebook')?.toString() || null;
    const twitter = formData.get('twitter')?.toString() || null;
    const youtube = formData.get('youtube')?.toString() || null;

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

    // Insert or update tenant config (singleton id: 'modulacao')
    const currentConfig = await db.select().from(tenantConfig).where(eq(tenantConfig.id, 'modulacao')).limit(1);

    if (currentConfig.length > 0) {
      await db.update(tenantConfig)
        .set({ name, contactEmail: email, instagram, facebook, twitter, youtube, updatedAt: new Date() })
        .where(eq(tenantConfig.id, 'modulacao'));
    } else {
      await db.insert(tenantConfig).values({
        id: 'modulacao',
        name,
        contactEmail: email,
        instagram,
        facebook,
        twitter,
        youtube,
        updatedAt: new Date()
      });
    }

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
