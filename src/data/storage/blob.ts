// import { put, del } from '@vercel/blob';

/**
 * Uploads a file to Vercel Blob storage.
 */
export async function uploadImage(file: File, filename: string) {
  // const blob = await put(filename, file, { access: 'public' });
  // return blob.url;
  return 'https://dummyimage.com/600x400/000/fff&text=Mock+Image';
}

/**
 * Deletes a file from Vercel Blob storage by URL.
 */
export async function deleteImage(url: string) {
  // await del(url);
  console.log(`Mock delete image: ${url}`);
}