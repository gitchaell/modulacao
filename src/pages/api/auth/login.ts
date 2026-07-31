import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { users } from '@/data/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      return new Response('Email and password are required', { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return new Response('Invalid credentials', { status: 401 });
    }

    const response = redirect('/app/comunidad');
    const session = await getSession(request, response);

    session.userId = user.id;
    session.role = user.role;
    await session.save();

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};