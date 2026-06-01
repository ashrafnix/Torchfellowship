import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET /api/profile/me — returns the authenticated user's profile
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  return NextResponse.json(user);
}

// PUT /api/profile/me — update profile (fullName, avatarUrl, currentPassword, newPassword)
export async function PUT(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const { fullName, avatarUrl, currentPassword, newPassword } = await req.json();
    const updateData: Record<string, string> = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    if (newPassword) {
      if (!currentPassword) {
        return apiError('Current password is required to update your password.', 400);
      }
      
      const userRef = adminDb.collection('users').doc(user.id);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return apiError('User account not found.', 404);
      }
      
      const userData = userDoc.data()!;
      const passwordMatch = await bcrypt.compare(currentPassword, userData.password || '');
      if (!passwordMatch) {
        return apiError('The current password you entered is incorrect.', 400);
      }

      if (newPassword.length < 6) {
        return apiError('New password must be at least 6 characters long.', 400);
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedNewPassword;
    }

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
