import {v2 as cloudinary} from 'cloudinary';

import {config} from 'dotenv';

config();
// This module configures Cloudinary for image and video management.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Add this debug log to verify it's being used
console.log('[✅ Cloudinary Config]', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : undefined,
});

export default cloudinary;
// This module exports the configured Cloudinary instance for use in other parts of the application.
// It uses environment variables to set the Cloudinary configuration, allowing for easy changes without modifying the code.