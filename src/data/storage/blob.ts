import { put, del } from '@vercel/blob';

/**
 * Uploads a file to Vercel Blob storage.
 */
export async function uploadImage(file: File, filename: string) {
  const blob = await put(filename, file, { access: 'public' });
  return blob.url;
}

/**
 * Deletes a file from Vercel Blob storage by URL.
 */
export async function deleteImage(url: string) {
  await del(url);
}