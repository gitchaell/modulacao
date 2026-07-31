import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { products } from '@/data/db/schema';
import crypto from 'node:crypto';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId || session.role !== 'ADMIN') {
       return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const price = formData.get('price')?.toString();
    const whatsappNumber = formData.get('whatsappNumber')?.toString();

    if (!name || !description || !price || !whatsappNumber) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + crypto.randomBytes(4).toString('hex');

    await db.insert(products).values({
      id: crypto.randomUUID(),
      name,
      slug,
      description,
      price,
      whatsappNumber,
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return redirect('/admin/catalogo');
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
