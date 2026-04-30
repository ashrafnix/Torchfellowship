import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const snap = await adminDb.collection('torch_kids').limit(1).get();
    if (snap.empty) return NextResponse.json(null);
    const d = snap.docs[0];
    return NextResponse.json({ id: d.id, ...d.data() });
  } catch (error) {
    return apiError('Failed to fetch Torch Kids content.');
  }
}

export async function PUT(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    const body = await req.json();
    const snap = await adminDb.collection('torch_kids').limit(1).get();
    if (snap.empty) {
      const docRef = await adminDb.collection('torch_kids').add(body);
      return NextResponse.json({ id: docRef.id, ...body });
    }
    await snap.docs[0].ref.update(body);
    return NextResponse.json({ id: snap.docs[0].id, ...body });
  } catch (error) {
    return apiError('Failed to update Torch Kids content.');
  }
}
