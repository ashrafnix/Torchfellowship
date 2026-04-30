import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    const { role } = await req.json();
    const { id } = await params;
    await adminDb.collection('users').doc(id).update({ role });
    return NextResponse.json({ message: 'User updated' });
  } catch (error) {
    return apiError('Failed to update user.');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    const resolvedParams = await params;
    await adminDb.collection('users').doc(resolvedParams.id).delete();
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return apiError('Failed to delete user.');
  }
}
