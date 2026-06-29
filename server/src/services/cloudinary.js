import env from '../config/env.js';

let cloudinary = null;
let storage = null;

async function initCloudinary() {
  if (cloudinary) return;
  try {
    const { v2 } = await import('cloudinary');
    cloudinary = v2;
    cloudinary.config({
      cloud_name: env.cloudinary.cloudName,
      api_key: env.cloudinary.apiKey,
      api_secret: env.cloudinary.apiSecret,
    });
  } catch {
    console.warn('Cloudinary not configured. File uploads will use local storage.');
  }
}

export async function uploadImage(file) {
  if (!cloudinary) {
    await initCloudinary();
  }

  if (cloudinary) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'furnture',
      transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    });
    return { url: result.secure_url, publicId: result.public_id };
  }

  return { url: file.path, publicId: null };
}

export async function deleteImage(publicId) {
  if (!cloudinary) {
    await initCloudinary();
  }
  if (cloudinary && publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
}
