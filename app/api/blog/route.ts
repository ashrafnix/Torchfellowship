import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

// GET /api/blog — public: published posts; admin: all posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    let query = adminDb.collection('blog_posts').orderBy('createdAt', 'desc');

    const snap = await query.get();
    let posts = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    
    // Filter in memory to avoid requiring a composite index in Firestore
    if (!all) {
      posts = posts.filter((p: any) => p.status === 'published');
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    return apiError('Failed to fetch blog posts.');
  }
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden('Only admins can create blog posts.');

  try {
    const body = await req.json();
    const data = {
      ...body,
      authorId: user.id,
      authorName: user.fullName || user.email,
      createdAt: new Date().toISOString(),
      status: body.status || 'draft',
    };
    const docRef = await adminDb.collection('blog_posts').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to create blog post.');
  }
}
