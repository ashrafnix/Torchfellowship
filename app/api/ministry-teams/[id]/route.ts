import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    const { id, ...updateData } = await req.json();
    await adminDb.collection('ministry_teams').doc((await params).id).update(updateData);
    return NextResponse.json({ message: 'Ministry team updated' });
  } catch (error) {
    return apiError('Failed to update ministry team.');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    await adminDb.collection('ministry_teams').doc((await params).id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError('Failed to delete ministry team.');
  }
}
