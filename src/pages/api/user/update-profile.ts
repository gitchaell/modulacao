import type { APIRoute } from 'astro';
import { db } from '@/data/db/db';
import { profiles, users } from '@/data/db/schema';
import { uploadImage } from '@/data/storage/blob';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';

import { getSession } from '@/utils/session';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const response = new Response();
    const session = await getSession(request, response);

    if (!session.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const formData = await request.formData();
    const fullName = formData.get('fullName')?.toString();
    const slug = formData.get('slug')?.toString();
    const city = formData.get('city')?.toString();
    const country = formData.get('country')?.toString();
    const bio = formData.get('bio')?.toString();
    const avatarFile = formData.get('avatar') as File | null;

    if (!fullName || !slug) {
      return new Response(JSON.stringify({ error: 'Name and Slug are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    let avatarUrl = undefined;
    if (avatarFile && avatarFile.size > 0) {
      const filename = `avatars/${crypto.randomUUID()}-${avatarFile.name}`;
      avatarUrl = await uploadImage(avatarFile, filename);
    }

    const updateData: any = {
      fullName,
      slug,
      city: city || null,
      country: country || null,
      bio: bio || null,
      updatedAt: new Date()
    };

    if (avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }

    await db.update(profiles)
      .set(updateData)
      .where(eq(profiles.userId, session.userId));

    return redirect('/app/ajustes');
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};