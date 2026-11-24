import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'portofolio-faris',
        resource_type: 'image',
        format: 'webp',
        transformation: options.transformation || [
          { width: 1280, height: 720, crop: 'fill', gravity: 'auto' },
          { quality: 'auto:good' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId) {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
