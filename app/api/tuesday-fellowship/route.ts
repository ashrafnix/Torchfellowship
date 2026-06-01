import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

// GET /api/tuesday-fellowship — fetch all registrations (Admins only)
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();

  try {
    const snap = await adminDb
      .collection('tuesday_fellowship_registrations')
      .orderBy('createdAt', 'desc')
      .get();
      
    const registrations = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Fetch tuesday fellowship registrations error:', error);
    return apiError('Failed to fetch registrations.');
  }
}

// POST /api/tuesday-fellowship — create a new registration (Public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, isFirstTimeVisitor, wishesToVolunteer, placeOfResidence } = body;

    // Basic validation
    if (!name || !contact || !placeOfResidence) {
      return NextResponse.json(
        { message: 'Name, contact, and place of residence are required.' },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection('tuesday_fellowship_registrations').add({
      name,
      contact,
      isFirstTimeVisitor: Boolean(isFirstTimeVisitor),
      wishesToVolunteer: Boolean(wishesToVolunteer),
      placeOfResidence,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: 'Registration successful!', id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create tuesday fellowship registration error:', error);
    return apiError('Failed to submit registration.');
  }
}
