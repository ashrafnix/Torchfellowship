import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const snap = await adminDb.collection('testimonies').orderBy('created_at', 'desc').get();
    const testimonies = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(testimonies);
  } catch (error) {
    return apiError('Failed to fetch testimonies.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = { ...body, created_at: new Date().toISOString(), is_approved: false };
    const docRef = await adminDb.collection('testimonies').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to create testimony.');
  }
}
