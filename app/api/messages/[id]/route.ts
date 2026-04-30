import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

// PUT /api/messages/[id] â" update reaction or read status
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const body = await req.json();
    const { action, emoji } = body;

    if (action === 'read') {
      const { id } = await params;
      await adminDb.collection('messages').doc(id).update({
        read: true,
        delivered: true,
        readAt: new Date().toISOString(),
        deliveredAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'delivered') {
      const { id } = await params;
      await adminDb.collection('messages').doc(id).update({
        delivered: true,
        deliveredAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'reaction' && emoji) {
      const msgDoc = await adminDb.collection('messages').doc((await params).id).get();
      if (!msgDoc.exists) return apiError('Message not found.', 404);

      const data = msgDoc.data()!;
      const reactions: Record<string, { count: number; users: string[] }> = data.reactions || {};

      if (!reactions[emoji]) reactions[emoji] = { count: 0, users: [] };

      const idx = reactions[emoji].users.indexOf(user.id);
      if (idx > -1) {
        reactions[emoji].users.splice(idx, 1);
        reactions[emoji].count--;
        if (reactions[emoji].count === 0) delete reactions[emoji];
      } else {
        reactions[emoji].users.push(user.id);
        reactions[emoji].count++;
      }

      await adminDb.collection('messages').doc((await params).id).update({ reactions });
      return NextResponse.json({ success: true });
    }

    return apiError('Invalid action.', 400);
  } catch (error) {
    return apiError('Failed to update message.');
  }
}
