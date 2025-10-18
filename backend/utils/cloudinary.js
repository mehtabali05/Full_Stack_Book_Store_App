import dotenv from "dotenv"
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryConfig = cloudinary;

// utils/cloudinary.js
// import { v2 as cloudinary } from 'cloudinary';

// const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
// console.log(`objects = { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET }`);

// // Helpful check (will log booleans only — not secrets)
// if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
//   console.error('Cloudinary env vars missing:', {
//     CLOUDINARY_CLOUD_NAME: !!CLOUDINARY_CLOUD_NAME,
//     CLOUDINARY_API_KEY: !!CLOUDINARY_API_KEY,
//     CLOUDINARY_API_SECRET: !!CLOUDINARY_API_SECRET,
//   });
//   // Optionally throw to fail fast:
//   // throw new Error('Missing Cloudinary environment variables. Check .env and dotenv.config() placement.');
// }

// cloudinary.config({
//   cloud_name: CLOUDINARY_CLOUD_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET,
// });

// export default cloudinary;
