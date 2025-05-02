import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import fs from 'fs/promises';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file) => {
  try {
    if (!file || !file.path) {
      throw new Error('No file provided or invalid file');
    }

    await fs.access(file.path);
    
    const options = {
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: true
    };

    const result = await cloudinary.uploader.upload(file.path, options);
    if (!result || !result.secure_url) {
      throw new Error('Failed to get upload URL from Cloudinary');
    }
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
  }
};

export default cloudinary;
