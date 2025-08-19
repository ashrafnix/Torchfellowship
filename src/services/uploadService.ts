import { getApiUrl } from '../config/api';

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('You must be logged in to upload images.');
  }

  // Step 1: Get signature from our backend
  const signatureResponse = await fetch(getApiUrl('/api/cloudinary/signature'), {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ folder }),
  });

  if (!signatureResponse.ok) {
    throw new Error('Could not get an upload signature from the server.');
  }

  const { signature, timestamp, api_key, cloud_name } = await signatureResponse.json();

  // Step 2: Use signature to upload directly to Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('api_key', api_key);
  formData.append('folder', folder);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

  const uploadResponse = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error('Image upload to Cloudinary failed.');
  }

  const uploadData = await uploadResponse.json();
  return uploadData.secure_url;
};