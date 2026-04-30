import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

// PUT /api/teachings/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const { id, ...updateData } = await req.json();
    await adminDb.collection('teachings').doc((await params).id).update(updateData);
    return NextResponse.json({ message: 'Teaching updated successfully' });
  } catch (error) {
    return apiError('Failed to update teaching.');
  }
}

// DELETE /api/teachings/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    await adminDb.collection('teachings').doc((await params).id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError('Failed to delete teaching.');
  }
}
