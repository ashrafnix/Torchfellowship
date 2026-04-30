import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { apiError } from '@/lib/auth';

// GET /api/site-content?page=home
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    let query = adminDb.collection('site_content') as any;
    if (page) query = query.where('page', '==', page);
    const snap = await query.get();
    const content = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(page ? (content[0] || null) : content);
  } catch (error) {
    return apiError('Failed to fetch site content.');
  }
}

// PUT /api/site-content — upsert by page
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { page, elements } = body;
    if (!page) return apiError('Page is required.', 400);

    const snap = await adminDb.collection('site_content').where('page', '==', page).limit(1).get();

    if (snap.empty) {
      const docRef = await adminDb.collection('site_content').add({ page, elements });
      return NextResponse.json({ id: docRef.id, page, elements });
    } else {
      await snap.docs[0].ref.update({ elements });
      return NextResponse.json({ id: snap.docs[0].id, page, elements });
    }
  } catch (error) {
    return apiError('Failed to update site content.');
  }
}
