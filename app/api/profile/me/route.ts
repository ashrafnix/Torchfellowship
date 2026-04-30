import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

// GET /api/profile/me — returns the authenticated user's profile
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  return NextResponse.json(user);
}

// PUT /api/profile/me — update profile (fullName, avatarUrl)
export async function PUT(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const { fullName, avatarUrl } = await req.json();
    const updateData: Record<string, string> = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    await adminDb.collection('users').doc(user.id).update(updateData);

    const updated = await adminDb.collection('users').doc(user.id).get();
    const d = updated.data()!;
    return NextResponse.json({
      id: updated.id,
      email: d.email,
      fullName: d.fullName ?? null,
      role: d.role,
      avatarUrl: d.avatarUrl ?? null,
      createdAt: d.createdAt,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return apiError('Failed to update profile.');
  }
}
