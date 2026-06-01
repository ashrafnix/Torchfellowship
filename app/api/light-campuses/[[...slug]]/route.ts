import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

// Helper: Ensure the user is an admin
async function checkAdmin(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return { error: unauthorized(), user: null };
  if (!isAdmin(user)) return { error: forbidden(), user: null };
  return { error: null, user };
}

// GET /api/light-campuses/[[...slug]]
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = (await params).slug || [];

  try {
    // 1. GET /api/light-campuses/admin/applications — Fetch all proposals (Admins only)
    if (slug[0] === 'admin' && slug[1] === 'applications') {
      const { error } = await checkAdmin(req);
      if (error) return error;

      const snap = await adminDb
        .collection('light_campus_applications')
        .orderBy('createdAt', 'desc')
        .get();
      const applications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return NextResponse.json(applications);
    }

    // 2. GET /api/light-campuses/admin/all — Fetch all campuses including inactive (Admins only)
    if (slug[0] === 'admin' && slug[1] === 'all') {
      const { error } = await checkAdmin(req);
      if (error) return error;

      const snap = await adminDb.collection('light_campuses').orderBy('createdAt', 'asc').get();
      const campuses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return NextResponse.json(campuses);
    }

    // 3. GET /api/light-campuses/public or GET /api/light-campuses — Fetch active campuses (Public)
    const snap = await adminDb
      .collection('light_campuses')
      .where('isActive', '==', true)
      .get();
    const campuses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(campuses);
  } catch (error) {
    console.error('Campus GET error:', error);
    return apiError('Failed to retrieve campus records.');
  }
}

// POST /api/light-campuses/[[...slug]]
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = (await params).slug || [];

  try {
    // 1. POST /api/light-campuses/apply — Submit a new campus application (Authenticated Public Users)
    if (slug[0] === 'apply') {
      const user = await verifyAuth(req);
      if (!user) return unauthorized();

      const body = await req.json();
      const { proposedCampusName, proposedLocation, proposedLeaderName, contactInfo, missionStatement } = body;

      if (!proposedCampusName || !proposedLocation || !proposedLeaderName || !contactInfo || !missionStatement) {
        return NextResponse.json(
          { message: 'All application fields are required.' },
          { status: 400 }
        );
      }

      const application = {
        applicantUserId: user.id,
        applicantName: user.fullName || user.email,
        applicantEmail: user.email,
        avatarUrl: user.avatarUrl || null,
        name: proposedCampusName,
        location: proposedLocation,
        description: missionStatement,
        proposedLeaderName,
        contactInfo,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await adminDb.collection('light_campus_applications').add(application);
      return NextResponse.json({ id: docRef.id, ...application }, { status: 201 });
    }

    // 2. POST /api/light-campuses/admin — Create a campus directly (Admins only)
    if (slug[0] === 'admin') {
      const { error } = await checkAdmin(req);
      if (error) return error;

      const body = await req.json();
      const data = {
        ...body,
        createdAt: new Date().toISOString(),
        isActive: body.isActive !== false,
      };

      const docRef = await adminDb.collection('light_campuses').add(data);
      return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
    }

    return apiError('Invalid request endpoint.', 404);
  } catch (error) {
    console.error('Campus POST error:', error);
    return apiError('Failed to create campus record.');
  }
}

// PUT /api/light-campuses/[[...slug]]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = (await params).slug || [];

  const { error } = await checkAdmin(req);
  if (error) return error;

  try {
    // 1. PUT /api/light-campuses/admin/applications/[id]/[action] — Approve or Reject application
    if (slug[0] === 'admin' && slug[1] === 'applications' && slug[2] && slug[3]) {
      const id = slug[2];
      const action = slug[3]; // 'approve' | 'reject'

      const appRef = adminDb.collection('light_campus_applications').doc(id);
      const appDoc = await appRef.get();
      if (!appDoc.exists) return apiError('Application not found.', 404);

      const appData = appDoc.data()!;

      if (action === 'approve') {
        // Update application status
        await appRef.update({ status: 'Approved' });

        // Add to active campuses
        const newCampus = {
          name: appData.name,
          location: appData.location,
          leaderName: appData.proposedLeaderName,
          contactInfo: appData.contactInfo,
          meetingSchedule: 'To be determined',
          isActive: true,
          images: [],
          createdAt: new Date().toISOString(),
        };

        const campusRef = await adminDb.collection('light_campuses').add(newCampus);
        return NextResponse.json({ id: campusRef.id, ...newCampus });
      } else if (action === 'reject') {
        await appRef.update({ status: 'Rejected' });
        return NextResponse.json({ message: 'Application rejected.' });
      }

      return apiError('Invalid application action.', 400);
    }

    // 2. PUT /api/light-campuses/admin/[id] — Update campus (Admins only)
    if (slug[0] === 'admin' && slug[1] && !slug[2]) {
      const id = slug[1];
      const body = await req.json();
      const { id: _, ...updateData } = body;

      await adminDb.collection('light_campuses').doc(id).update(updateData);
      const updated = await adminDb.collection('light_campuses').doc(id).get();

      return NextResponse.json({ id: updated.id, ...updated.data() });
    }

    return apiError('Invalid endpoint.', 404);
  } catch (error) {
    console.error('Campus PUT error:', error);
    return apiError('Failed to update campus record.');
  }
}

// DELETE /api/light-campuses/[[...slug]]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = (await params).slug || [];

  const { error } = await checkAdmin(req);
  if (error) return error;

  try {
    // 1. DELETE /api/light-campuses/admin/[id] — Delete campus (Admins only)
    if (slug[0] === 'admin' && slug[1]) {
      const id = slug[1];
      await adminDb.collection('light_campuses').doc(id).delete();
      return new NextResponse(null, { status: 204 });
    }

    return apiError('Invalid endpoint.', 404);
  } catch (error) {
    console.error('Campus DELETE error:', error);
    return apiError('Failed to delete campus record.');
  }
}
