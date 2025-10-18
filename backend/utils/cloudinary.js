// import dotenv from "dotenv"
// dotenv.config();
// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const cloudinaryConfig = cloudinary;



import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

export function getCloudinary() {
  if (!isConfigured) {
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      console.warn("⚠️ Cloudinary env vars are missing — using fallback (will crash if used)");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    isConfigured = true;
  }

  return cloudinary;
}
