import { getDb } from '../server.js';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';

const formatCampusForClient = (campus) => {
    if (!campus) return null;
    return { ...campus, _id: campus._id.toHexString() };
};

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
        const db = getDb();
        const { proposedCampusName, proposedLocation, missionStatement, proposedLeaderName, contactInfo } = req.body;
        const user = req.user;

        if (!proposedCampusName || !proposedLocation || !missionStatement) {
            return next(new AppError('Campus name, location, and mission statement are required.', 400));
        }

        const newApplication = {
            name: proposedCampusName,
            location: proposedLocation,
            description: missionStatement,
            proposedLeaderName,
            contactInfo,
            userId: user._id.toHexString(),
            userName: user.fullName || user.email,
            status: 'Pending',
            createdAt: new Date().toISOString(),
        };

        await db.collection('light_campus_applications').insertOne(newApplication);
        res.status(201).json({ message: 'Application submitted successfully.' });
    } catch (error) {
        next(new AppError('Failed to submit application.', 500));
    }
};

export const getAllCampusesAdmin = async (req, res, next) => {
    try {
        const db = getDb();
        const campuses = await db.collection('light_campuses').find({}).sort({ name: 1 }).toArray();
        res.status(200).json(campuses.map(formatCampusForClient));
    } catch (error) {
        next(new AppError('Failed to fetch all light campuses.', 500));
    }
};

export const createCampusAdmin = async (req, res, next) => {
    try {
        const db = getDb();
        const { name, location, description } = req.body;

        if (!name || !location || !description) {
            return next(new AppError('Name, location, and description are required.', 400));
        }

        const newCampus = {
            name,
            location,
            description,
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        const result = await db.collection('light_campuses').insertOne(newCampus);
        const createdCampus = { ...newCampus, _id: result.insertedId };
        
        res.status(201).json(formatCampusForClient(createdCampus));
    } catch (error) {
        next(new AppError('Failed to create light campus.', 500));
    }
};

export const updateCampusAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, location, description, isActive } = req.body;

        if (!ObjectId.isValid(id)) {
            return next(new AppError('Invalid campus ID.', 400));
        }

        const db = getDb();
        const updatedFields = { name, location, description, isActive };

        const result = await db.collection('light_campuses').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedFields }
        );

        if (result.matchedCount === 0) {
            return next(new AppError('Light campus not found.', 404));
        }

        const updatedCampus = await db.collection('light_campuses').findOne({ _id: new ObjectId(id) });
        res.status(200).json(formatCampusForClient(updatedCampus));
    } catch (error) {
        next(new AppError('Failed to update light campus.', 500));
    }
};

export const deleteCampusAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return next(new AppError('Invalid campus ID.', 400));
        }

        const db = getDb();
        const result = await db.collection('light_campuses').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return next(new AppError('Light campus not found.', 404));
        }

        res.status(200).json({ message: 'Light campus deleted successfully.' });
    } catch (error) {
        next(new AppError('Failed to delete light campus.', 500));
    }
};

export const getAllApplicationsAdmin = async (req, res, next) => {
    try {
        const db = getDb();
        const applications = await db.collection('light_campus_applications')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        res.status(200).json(applications);
    } catch (error) {
        next(new AppError('Failed to fetch light campus applications.', 500));
    }
};

export const approveApplicationAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return next(new AppError('Invalid application ID.', 400));
        }

        const db = getDb();
        const application = await db.collection('light_campus_applications').findOne({ _id: new ObjectId(id) });

        if (!application) {
            return next(new AppError('Application not found.', 404));
        }

        const newCampus = {
            name: application.name,
            location: application.location,
            description: application.description,
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        await db.collection('light_campuses').insertOne(newCampus);
        await db.collection('light_campus_applications').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'Approved' } }
        );

        res.status(200).json({ message: 'Application approved and campus created.' });
    } catch (error) {
        next(new AppError('Failed to approve application.', 500));
    }
};

export const rejectApplicationAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return next(new AppError('Invalid application ID.', 400));
        }

        const db = getDb();
        const result = await db.collection('light_campus_applications').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'Rejected' } }
        );

        if (result.matchedCount === 0) {
            return next(new AppError('Application not found.', 404));
        }

        res.status(200).json({ message: 'Application rejected.' });
    } catch (error) {
        next(new AppError('Failed to reject application.', 500));
    }
};