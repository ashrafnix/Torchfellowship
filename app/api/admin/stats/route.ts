import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth, unauthorized, isAdmin, forbidden, apiError } from '@/lib/auth';

// GET /api/admin/stats — dashboard statistics
export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (!isAdmin(user)) return forbidden();

  try {
    // Run all Firestore count queries in parallel
    const [
      usersSnap,
      teachingsSnap,
      eventsSnap,
      prayerSnap,
      testimonySnap,
      blogSnap,
      ministrySnap,
      volunteerSnap,
      campusSnap,
      contactSnap,
    ] = await Promise.all([
      adminDb.collection('users').count().get(),
      adminDb.collection('teachings').count().get(),
      adminDb.collection('events').count().get(),
      adminDb.collection('prayer_requests').count().get(),
      adminDb.collection('testimonies').count().get(),
      adminDb.collection('blog_posts').count().get(),
      adminDb.collection('ministry_teams').count().get(),
      adminDb.collection('volunteers').count().get(),
      adminDb.collection('light_campuses').count().get(),
      adminDb.collection('contact_messages').count().get(),
    ]);

    // Get recent users (last 5)
    const recentUsersSnap = await adminDb
      .collection('users')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    const recentUsers = recentUsersSnap.docs.map((d) => {
      const { password, ...rest } = d.data() as any;
      return { id: d.id, ...rest };
    });

    return NextResponse.json({
      stats: {
        totalUsers: usersSnap.data().count,
        totalTeachings: teachingsSnap.data().count,
        totalEvents: eventsSnap.data().count,
        totalPrayerRequests: prayerSnap.data().count,
        totalTestimonies: testimonySnap.data().count,
        totalBlogPosts: blogSnap.data().count,
        totalMinistryTeams: ministrySnap.data().count,
        totalVolunteers: volunteerSnap.data().count,
        totalCampuses: campusSnap.data().count,
        totalContactMessages: contactSnap.data().count,
      },
      recentUsers,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return apiError('Failed to fetch admin statistics.');
  }
}
