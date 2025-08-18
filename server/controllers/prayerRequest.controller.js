
import { getDb } from '../db/index.js';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';

// --- PUBLIC-FACING CONTROLLERS ---

export const getPublicPrayerRequests = async (req, res, next) => {
    try {
        const db = getDb();
        // Get public, unanswered requests, sorted by newest first
        const dbRequests = await db.collection('prayer_requests')
            .find({ is_private: false, is_answered: false })
            .sort({ created_at: -1 })
            .toArray();
        const requests = dbRequests.map((r) => ({...r, _id: r._id.toHexString()}));
        res.status(200).json(requests);
    } catch (error) {
        next(new AppError('Failed to fetch public prayer requests.', 500));
    }
};

export const createPublicPrayerRequest = async (req, res, next) => {
    try {
        const db = getDb();
        const { name, email, request_text, share_publicly } = req.body;
        
        if (!name || !request_text) {
             return next(new AppError('Name and prayer request are required.', 400));
        }

        const newRequest = { 
            name,
            email: email || '', // Email is optional
            request_text,
            is_private: !share_publicly, // If share_publicly is true/checked, is_private is false
            is_answered: false, // Default to unanswered
            created_at: new Date().toISOString(),
        };
        const result = await db.collection('prayer_requests').insertOne(newRequest);
        const createdRequest = {...newRequest, _id: result.insertedId.toHexString()};
        res.status(201).json({ message: "Prayer request submitted successfully.", newRequest: createdRequest});
    } catch (error) {
        next(new AppError('Failed to submit prayer request.', 500));
    }
};


// --- ADMIN-ONLY CONTROLLERS ---

export const getAllPrayerRequests = async (req, res, next) => {
    try {
        const db = getDb();
        const dbRequests = await db.collection('prayer_requests').find({}).sort({ created_at: -1 }).toArray();
        const requests = dbRequests.map((r) => ({...r, _id: r._id.toHexString()}));
        res.status(200).json(requests);
    } catch (error) {
        next(new AppError('Failed to fetch prayer requests.', 500));
    }
};

export const updatePrayerRequest = async (req, res, next) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const { _id, ...updateData } = req.body;
        const result = await db.collection('prayer_requests').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
        if(result.matchedCount === 0) return next(new AppError('Prayer request not found', 404));
        res.status(200).json({ message: 'Prayer request updated successfully' });
    } catch (error) {
        next(new AppError('Failed to update prayer request.', 500));
    }
};

export const deletePrayerRequest = async (req, res, next) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const result = await db.collection('prayer_requests').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return next(new AppError('Prayer request not found', 404));
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete prayer request.', 500));
    }
};
