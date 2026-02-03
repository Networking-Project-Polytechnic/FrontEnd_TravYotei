export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME1,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET1,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY1,
  apiSecret: process.env.CLOUDINARY_API_SECRET1,
} as const;

// Add validation
if (!cloudinaryConfig.cloudName) {
  console.warn('⚠️ Cloudinary cloud name is not configured. Check your .env file.');
}