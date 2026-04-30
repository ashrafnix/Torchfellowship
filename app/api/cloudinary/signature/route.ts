import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary signature endpoint — unchanged logic from original server
export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const { folder } = await req.json();
    if (!folder) return apiError('A folder must be specified for the upload.', 400);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      return apiError('Cloudinary is not properly configured on the server.', 503);
    }

    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      apiSecret
    );

    return NextResponse.json({ timestamp, signature, cloud_name: cloudName, api_key: apiKey });
  } catch (error) {
    console.error('Cloudinary signature error:', error);
    return apiError('Could not generate upload signature.');
  }
}
