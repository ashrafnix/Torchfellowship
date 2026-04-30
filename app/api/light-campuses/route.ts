import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const snap = await adminDb.collection('light_campuses').orderBy('createdAt', 'asc').get();
    return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (error) {
    return apiError('Failed to fetch light campuses.');
  }
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    const body = await req.json();
    const data = { ...body, createdAt: new Date().toISOString(), isActive: true };
    const docRef = await adminDb.collection('light_campuses').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to create light campus.');
  }
}
