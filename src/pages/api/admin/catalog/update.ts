import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { products } from '@/data/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
       return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const price = formData.get('price')?.toString();
    const whatsappNumber = formData.get('whatsappNumber')?.toString();

    if (!id || !name || !description || !price || !whatsappNumber) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    await db.update(products)
      .set({
        name,
        description,
        price,
        whatsappNumber,
        updatedAt: new Date()
      })
      .where(eq(products.id, id));

    return redirect('/admin/catalogo');
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
