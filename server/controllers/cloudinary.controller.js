import { v2 as cloudinary } from 'cloudinary';
import AppError from '../utils/AppError.js';

// Check if Cloudinary configuration is available
const hasCloudinaryConfig = () => {
  const hasConfig = (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
  
  if (!hasConfig) {
    console.error('❌ Missing Cloudinary configuration. Please check environment variables.');
  }
  
  return hasConfig;
};

// Configure Cloudinary if possible
if (hasCloudinaryConfig()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured successfully');
}

export const getUploadSignature = (req, res, next) => {
  try {
    // Check if Cloudinary is configured
    if (!hasCloudinaryConfig()) {
      return next(new AppError('Cloudinary is not properly configured on the server.', 503));
    }
    
    const { folder } = req.body;
    if (!folder) {
        return next(new AppError('A folder must be specified for the upload.', 400));
    }
    
    const timestamp = Math.round((new Date).getTime()/1000);

    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        folder: folder
    }, process.env.CLOUDINARY_API_SECRET);

    res.status(200).json({ 
      timestamp, 
      signature, 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
    });

  } catch (error) {
     console.error("Error generating Cloudinary signature:", error);
     next(new AppError('Could not generate upload signature.', 500));
  }
};