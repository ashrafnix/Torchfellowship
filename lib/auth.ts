import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminDb } from '@/lib/firebase/admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  avatarUrl: string | null;
}

/**
 * Extract and verify the JWT from the Authorization header.
 * Returns the decoded user payload, or null if invalid/missing.
 */
export async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    // Fetch user from Firestore to get latest role/data
    const userDoc = await adminDb.collection('users').doc(decoded.id).get();
    if (!userDoc.exists) return null;
    const data = userDoc.data()!;
    return {
      id: userDoc.id,
      email: data.email,
      fullName: data.fullName ?? null,
      role: data.role,
      avatarUrl: data.avatarUrl ?? null,
    };
  } catch (error) {
    console.error('verifyAuth failed:', error);
    return null;
  }
}

/**
 * Returns a 401 Unauthorized response.
 */
export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ status: 'error', message }, { status: 401 });
}

/**
 * Returns a 403 Forbidden response.
 */
export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ status: 'error', message }, { status: 403 });
}

/**
 * Returns a generic error response.
 */
export function apiError(message: string, status = 500) {
  return NextResponse.json({ status: 'error', message }, { status });
}

/**
 * Check if a user has admin or super-admin role.
 */
export function isAdmin(user: AuthUser): boolean {
  return user.role === 'Admin' || user.role === 'Super-Admin';
}
