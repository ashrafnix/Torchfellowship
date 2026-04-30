import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

// GET /api/teachings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 0;

    let query = adminDb.collection('teachings').orderBy('preached_at', 'desc');
    if (limit > 0) query = query.limit(limit) as any;

    const snap = await query.get();
    const teachings = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(teachings);
  } catch (error) {
    return apiError('Failed to fetch teachings.');
  }
}

// POST /api/teachings
export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const body = await req.json();
    const data = { ...body, created_at: new Date().toISOString() };
    const docRef = await adminDb.collection('teachings').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to create teaching.');
  }
}
