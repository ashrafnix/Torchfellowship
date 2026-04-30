import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    const { id, ...updateData } = await req.json();
    await adminDb.collection('light_campuses').doc((await params).id).update(updateData);
    const updated = await adminDb.collection('light_campuses').doc((await params).id).get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    return apiError('Failed to update light campus.');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    await adminDb.collection('light_campuses').doc((await params).id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError('Failed to delete light campus.');
  }
}
