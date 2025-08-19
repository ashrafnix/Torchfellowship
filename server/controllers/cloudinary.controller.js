import { v2 as cloudinary } from 'cloudinary';
import AppError from '../utils/AppError.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getUploadSignature = (req, res, next) => {
  try {
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