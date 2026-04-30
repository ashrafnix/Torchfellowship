import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const snap = await adminDb.collection('new_converts').orderBy('createdAt', 'desc').get();
    return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (error) {
    return apiError('Failed to fetch new converts.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = { ...body, createdAt: new Date().toISOString() };
    const docRef = await adminDb.collection('new_converts').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to register new convert.');
  }
}
