
import { getDb } from '../db/index.js';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';

const formatCampusForClient = (campus) => {
    if (!campus) return null;
    return { ...campus, _id: campus._id.toHexString() };
};

const formatApplicationForClient = (app) => {
    if (!app) return null;
    return { ...app, _id: app._id.toHexString() };
};

// --- PUBLIC & USER ROUTES ---

export const getPublicCampuses = async (req, res, next) => {
    try {
        const db = getDb();
        const campuses = await db.collection('light_campuses').find({ isActive: true }).sort({ name: 1 }).toArray();
        res.status(200).json(campuses.map(formatCampusForClient));
    } catch (error) {
        next(new AppError('Failed to fetch light campuses.', 500));
    }
};

export const applyForCampus = async (req, res, next) => {
    try {
        const user = req.user;
        const { proposedCampusName, proposedLocation, proposedLeaderName, contactInfo, missionStatement } = req.body;
        if (!proposedCampusName || !proposedLocation || !proposedLeaderName || !contactInfo || !missionStatement) {
            return next(new AppError('All application fields are required.', 400));
        }

        const db = getDb();
        const newApplication = {
            applicantUserId: user._id.toHexString(),
            applicantName: user.fullName || user.email,
            applicantEmail: user.email,
            proposedCampusName,
            proposedLocation,
            proposedLeaderName,
            contactInfo,
            missionStatement,
            status: 'Pending',
            createdAt: new Date().toISOString(),
        };

        await db.collection('light_campus_applications').insertOne(newApplication);
        res.status(201).json({ message: 'Application submitted successfully.' });
    } catch (error) {
        next(new AppError('Failed to submit application.', 500));
    }
};

// --- ADMIN ROUTES ---

export const getAllCampusesAdmin = async (req, res, next) => {
    try {
        const db = getDb();
        const campuses = await db.collection('light_campuses').find({}).sort({ name: 1 }).toArray();
        res.status(200).json(campuses.map(formatCampusForClient));
    } catch (error) {
        next(new AppError('Failed to fetch campuses for admin.', 500));
    }
};

export const createCampusAdmin = async (req, res, next) => {
    try {
        const { name, location, leaderName, contactInfo, meetingSchedule, isActive } = req.body;
        if (!name || !location || !leaderName || !contactInfo || !meetingSchedule) {
            return next(new AppError('All campus fields are required.', 400));
        }
        const db = getDb();
        const newCampus = { name, location, leaderName, contactInfo, meetingSchedule, isActive: isActive !== false, createdAt: new Date().toISOString() };
        const result = await db.collection('light_campuses').insertOne(newCampus);
        res.status(201).json(formatCampusForClient({ ...newCampus, _id: result.insertedId }));
    } catch (error) {
        next(new AppError('Failed to create campus.', 500));
    }
};

export const updateCampusAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id, createdAt, ...updateData } = req.body;
        const db = getDb();
        const result = await db.collection('light_campuses').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
        if (result.matchedCount === 0) return next(new AppError('Campus not found.', 404));
        res.status(200).json({ message: 'Campus updated successfully.' });
    } catch (error) {
        next(new AppError('Failed to update campus.', 500));
    }
};

export const deleteCampusAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDb();
        const result = await db.collection('light_campuses').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return next(new AppError('Campus not found.', 404));
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete campus.', 500));
    }
};

export const getAllApplicationsAdmin = async (req, res, next) => {
    try {
        const db = getDb();
        const applications = await db.collection('light_campus_applications').find({}).sort({ createdAt: -1 }).toArray();
        res.status(200).json(applications.map(formatApplicationForClient));
    } catch (error) {
        next(new AppError('Failed to fetch applications.', 500));
    }
};

export const approveApplicationAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDb();
        const application = await db.collection('light_campus_applications').findOne({ _id: new ObjectId(id) });

        if (!application || application.status !== 'Pending') {
            return next(new AppError('Application not found or already processed.', 404));
        }

        // Create a new campus from the application
        const newCampus = {
            name: application.proposedCampusName,
            location: application.proposedLocation,
            leaderName: application.proposedLeaderName,
            contactInfo: application.contactInfo,
            meetingSchedule: 'To be determined',
            isActive: true,
            createdAt: new Date().toISOString(),
        };
        await db.collection('light_campuses').insertOne(newCampus);

        // Update application status
        await db.collection('light_campus_applications').updateOne({ _id: new ObjectId(id) }, { $set: { status: 'Approved' } });

        res.status(200).json({ message: 'Application approved and campus created.' });
    } catch (error) {
        next(new AppError('Failed to approve application.', 500));
    }
};

export const rejectApplicationAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDb();
        const result = await db.collection('light_campus_applications').updateOne({ _id: new ObjectId(id) }, { $set: { status: 'Rejected' } });
        if (result.matchedCount === 0) return next(new AppError('Application not found.', 404));
        res.status(200).json({ message: 'Application rejected.' });
    } catch (error) {
        next(new AppError('Failed to reject application.', 500));
    }
};
