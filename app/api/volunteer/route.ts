import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const snap = await adminDb.collection('volunteers').orderBy('createdAt', 'desc').get();
    return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (error) {
    return apiError('Failed to fetch volunteer applications.');
  }
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  try {
    const body = await req.json();
    const data = {
      ...body,
      userId: user.id,
      userName: user.fullName || user.email,
      userEmail: user.email,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const docRef = await adminDb.collection('volunteers').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to submit volunteer application.');
  }
}
