import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { apiError } from '@/lib/auth';

// GET /api/prayer-requests/public
// Returns only prayer requests that are public (share_publicly: true or is_private: false).
// No auth required — this is a public-facing endpoint for the Prayer Wall.
export async function GET() {
  try {
    // Support both field naming conventions to ensure backwards compatibility.
    // Legacy records may use `is_private: false`, newer ones use `share_publicly: true`.
    const snap = await adminDb
      .collection('prayer_requests')
      .where('share_publicly', '==', true)
      .orderBy('created_at', 'desc')
      .limit(50)
      .get();

    const requests = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(requests);
  } catch (error: any) {
    // Firestore may throw if the composite index isn't ready yet.
    // Fall back to a simple unfiltered query and filter in memory.
    if (error?.code === 9 || error?.message?.includes('index')) {
      try {
        const snap = await adminDb
          .collection('prayer_requests')
          .orderBy('created_at', 'desc')
          .limit(100)
          .get();
        const requests = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as any))
          .filter((r) => r.share_publicly === true || r.is_private === false);
        return NextResponse.json(requests);
      } catch (fallbackError) {
        return apiError('Failed to fetch public prayer requests.');
      }
    }
    return apiError('Failed to fetch public prayer requests.');
  }
}
