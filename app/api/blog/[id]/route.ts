import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

// GET /api/blog/[id] - get by doc ID or slug
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Try direct doc ID first
    const docSnap = await adminDb.collection('blog_posts').doc(id).get();
    if (docSnap.exists) {
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
    }

    // Fallback: query by slug
    const slugSnap = await adminDb
      .collection('blog_posts')
      .where('slug', '==', id)
      .limit(1)
      .get();
    if (!slugSnap.empty) {
      const d = slugSnap.docs[0];
      return NextResponse.json({ id: d.id, ...d.data() });
    }
    return apiError('Blog post not found.', 404);
  } catch (error) {
    return apiError('Failed to fetch blog post.');
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    const { id, ...updateData } = await req.json();
    await adminDb.collection('blog_posts').doc((await params).id).update(updateData);
    return NextResponse.json({ message: 'Blog post updated' });
  } catch (error) {
    return apiError('Failed to update blog post.');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();
  try {
    await adminDb.collection('blog_posts').doc((await params).id).delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError('Failed to delete blog post.');
  }
}
