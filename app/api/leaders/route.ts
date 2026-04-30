import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const snap = await adminDb.collection('leaders').orderBy('createdAt', 'asc').get();
    const leaders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(leaders);
  } catch (error) {
    return apiError('Failed to fetch leaders.');
  }
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const { name, title, bio, photoUrl, youtubeUrl } = await req.json();
    if (!name || !title || !bio || !photoUrl || !youtubeUrl) {
      return apiError('All fields including photo are required.', 400);
    }
    const data = { name, title, bio, photoUrl, youtubeUrl, createdAt: new Date().toISOString() };
    const docRef = await adminDb.collection('leaders').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to create leader profile.');
  }
}
