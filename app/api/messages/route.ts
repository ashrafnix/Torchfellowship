import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

// GET /api/messages — fetch messages by type (community | admin | private)
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const chatType = searchParams.get('chatType') || 'community';
    const recipientId = searchParams.get('recipientId');

    let query;

    if (chatType === 'private' && recipientId) {
      // Private chat: get messages between two users
      const [a, b] = [user.id, recipientId].sort();
      query = adminDb
        .collection('messages')
        .where('chatType', '==', 'private')
        .where('participants', 'array-contains', user.id)
        .orderBy('created_at', 'asc')
        .limit(100);
    } else if (chatType === 'admin') {
      if (user.role !== 'Admin' && user.role !== 'Super-Admin') {
        return apiError('Access denied. Admin privileges required.', 403);
      }
      query = adminDb
        .collection('messages')
        .where('chatType', '==', 'admin')
        .orderBy('created_at', 'asc')
        .limit(100);
    } else {
      // community
      query = adminDb
        .collection('messages')
        .where('chatType', '==', 'community')
        .orderBy('created_at', 'asc')
        .limit(100);
    }

    const snap = await query.get();
    const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Messages GET error:', error);
    return apiError('Failed to fetch messages.');
  }
}

// POST /api/messages — send a new message
export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const body = await req.json();

    if (body.chatType === 'admin' && user.role !== 'Admin' && user.role !== 'Super-Admin') {
      return apiError('Access denied. Admin privileges required.', 403);
    }

    const messageData: Record<string, any> = {
      ...body,
      authorId: user.id,
      authorName: user.fullName || user.email,
      authorAvatar: user.avatarUrl || null,
      created_at: new Date().toISOString(),
      delivered: false,
      read: false,
      reactions: {},
    };

    // For private messages, store participants array for querying
    if (body.chatType === 'private' && body.recipientId) {
      messageData.participants = [user.id, body.recipientId].sort();
    }

    const docRef = await adminDb.collection('messages').add(messageData);

    // Mark community/admin messages as delivered immediately
    if (body.chatType === 'community' || body.chatType === 'admin') {
      await adminDb.collection('messages').doc(docRef.id).update({
        delivered: true,
        deliveredAt: new Date().toISOString(),
      });
      messageData.delivered = true;
    }

    return NextResponse.json({ id: docRef.id, ...messageData }, { status: 201 });
  } catch (error) {
    console.error('Messages POST error:', error);
    return apiError('Failed to send message.');
  }
}
