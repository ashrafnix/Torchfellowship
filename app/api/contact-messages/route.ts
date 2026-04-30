import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { apiError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return apiError('All fields are required.', 400);
    }
    const data = { name, email, subject, message, created_at: new Date().toISOString() };
    const docRef = await adminDb.collection('contact_messages').add(data);
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return apiError('Failed to send contact message.');
  }
}

export async function GET() {
  try {
    const snap = await adminDb.collection('contact_messages').orderBy('created_at', 'desc').get();
    return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (error) {
    return apiError('Failed to fetch contact messages.');
  }
}
