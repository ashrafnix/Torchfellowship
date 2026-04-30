import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const snap = await adminDb
      .collection('prayer_requests')
      .orderBy('created_at', 'desc')
      .get();
    const requests = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(requests);
  } catch (error) {
    return apiError('Failed to fetch prayer requests.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = { ...body, created_at: new Date().toISOString(), is_answered: false };
    const docRef = await adminDb.collection('prayer_requests').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to create prayer request.');
  }
}
