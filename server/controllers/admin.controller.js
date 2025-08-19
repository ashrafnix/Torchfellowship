import { getDb } from '../server.js';
import AppError from '../utils/AppError.js';

export const getDashboardStats = async (req, res, next) => {
    try {
        const db = getDb();
        const users = await db.collection('users').countDocuments();
        const teachings = await db.collection('teachings').countDocuments();
        const events = await db.collection('events').countDocuments();
        const prayers = await db.collection('prayer_requests').countDocuments();
        const leaders = await db.collection('leaders').countDocuments();
        const testimonies = await db.collection('testimonies').countDocuments();
        const ministryTeams = await db.collection('ministry_teams').countDocuments();
        const blogPosts = await db.collection('blog_posts').countDocuments();
        const lightCampuses = await db.collection('light_campuses').countDocuments({ isActive: true });
        const campusApplications = await db.collection('light_campus_applications').countDocuments({ status: 'Pending' });

        res.status(200).json({ users, teachings, events, prayers, leaders, testimonies, ministryTeams, blogPosts, lightCampuses, campusApplications });
    } catch (error) {
        next(new AppError('Failed to fetch dashboard statistics.', 500));
    }
};