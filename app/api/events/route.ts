import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const snap = await adminDb.collection('events').orderBy('event_date', 'asc').get();
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(events);
  } catch (error) {
    return apiError('Failed to fetch events.');
  }
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const body = await req.json();
    const data = { ...body, created_at: new Date().toISOString() };
    const docRef = await adminDb.collection('events').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to create event.');
  }
}
