import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const { name, title, bio, photoUrl, youtubeUrl } = await req.json();
    await adminDb.collection('leaders').doc((await params).id).update({ name, title, bio, photoUrl, youtubeUrl });
    const updated = await adminDb.collection('leaders').doc((await params).id).get();
    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    return apiError('Failed to update leader profile.');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    await adminDb.collection('leaders').doc((await params).id).delete();
    return NextResponse.json({ message: 'Leader deleted successfully.' });
  } catch (error) {
    return apiError('Failed to delete leader profile.');
  }
}
