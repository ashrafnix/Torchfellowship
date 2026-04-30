import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

// GET /api/users — admin only
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    const snap = await adminDb.collection('users').orderBy('createdAt', 'desc').get();
    const users = snap.docs.map((d) => {
      const { password, ...rest } = d.data() as any;
      return { id: d.id, ...rest };
    });
    return NextResponse.json(users);
  } catch (error) {
    return apiError('Failed to fetch users.');
  }
}
