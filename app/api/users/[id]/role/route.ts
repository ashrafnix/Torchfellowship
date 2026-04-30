import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

/**
 * PUT /api/users/[id]/role
 * - Any Admin can demote/promote users to User or Admin.
 * - Only Super-Admin can assign the Super-Admin role.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const caller = await verifyAuth(req);
  if (!caller) return unauthorized();
  if (!isAdmin(caller)) return forbidden();

  try {
    const { role } = await req.json();

    const validRoles = ['User', 'Admin', 'Super-Admin'];
    if (!validRoles.includes(role)) {
      return apiError('Invalid role provided.', 400);
    }

    // Only Super-Admin can assign the Super-Admin role
    if (role === 'Super-Admin' && caller.role !== 'Super-Admin') {
      return forbidden('Only a Super-Admin can assign the Super-Admin role.');
    }

    // Prevent any admin from demoting another Super-Admin (unless caller is also Super-Admin)
    const targetDoc = await adminDb.collection('users').doc((await params).id).get();
    if (!targetDoc.exists) return apiError('User not found.', 404);
    const targetData = targetDoc.data()!;

    if (targetData.role === 'Super-Admin' && caller.role !== 'Super-Admin') {
      return forbidden('Only a Super-Admin can change another Super-Admin\'s role.');
    }

    await adminDb.collection('users').doc((await params).id).update({ role });
    return NextResponse.json({ message: 'User role updated successfully.' });
  } catch (error) {
    return apiError('Failed to update user role.');
  }
}
