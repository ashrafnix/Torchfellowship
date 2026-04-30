import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    const resolvedParams = await params;
    const { id, ...updateData } = await req.json();
    await adminDb.collection('volunteers').doc(resolvedParams.id).update(updateData);
    return NextResponse.json({ message: 'Application updated' });
  } catch (error) {
    return apiError('Failed to update application.');
  }
}
