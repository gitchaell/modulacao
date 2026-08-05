import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { contactMessages } from '@/data/db/schema';
import crypto from 'node:crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const message = formData.get('message')?.toString();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await db.insert(contactMessages).values({
      id: crypto.randomUUID(),
      name,
      email,
      message,
      createdAt: new Date(),
    });

    console.log(`New contact message stored in database from ${name} (${email}).`);

    return new Response(JSON.stringify({ success: true, message: 'Mensaje enviado correctamente' }), {
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
