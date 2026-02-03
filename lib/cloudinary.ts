export const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
} as const;

// Add validation
if (!cloudinaryConfig.cloudName) {
  console.warn('⚠️ Cloudinary cloud name is not configured. Check your .env file.');
}