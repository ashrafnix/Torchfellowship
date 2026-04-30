import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { verifyAuth, apiError } from '@/lib/auth';

/**
 * GET /api/auth/firebase-token
 * Accepts the app's own JWT (Authorization: Bearer <jwt>),
 * returns a Firebase custom token so the client can call
 * signInWithCustomToken() and satisfy Firestore security rules.
 */
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return apiError('Unauthorized', 401);

  try {
    const firebaseToken = await adminAuth.createCustomToken(user.id, {
      role: user.role,
    });
    return NextResponse.json({ firebaseToken });
  } catch (err) {
    console.error('firebase-token error:', err);
    return apiError('Could not generate Firebase token');
  }
}
