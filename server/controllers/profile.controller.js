
import { getDb } from '../db/index.js';
import AppError from '../utils/AppError.js';
import { ObjectId } from 'mongodb';
import { formatUserForClient } from '../utils/userFormatter.js';

export const getMyProfile = (req, res, next) => {
    // req.user is attached by the authMiddleware
    if (!req.user) {
        return next(new AppError('User not found on request.', 404));
    }
    res.status(200).json(formatUserForClient(req.user));
};


export const updateMyProfile = async (req, res, next) => {
    try {
        // The user's ID comes from the auth middleware, ensuring they can only update their own profile.
        const userId = req.user._id;
        const { fullName, avatarUrl } = req.body;
        const db = getDb();

        const updateData = {};
        
        // Only add fields to the update object if they were provided in the request
        if (fullName) updateData.fullName = fullName;
        // Allows setting avatarUrl to a new string or removing it by passing null
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl; 

        if (Object.keys(updateData).length === 0) {
            return next(new AppError('No update data provided. Please provide a fullName or avatarUrl.', 400));
        }

        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return next(new AppError('User not found.', 404));
        }

        res.status(200).json({
            status: 'success',
            user: formatUserForClient(result.value),
        });
    } catch (error) {
        next(new AppError('Could not update profile.', 500));
    }
};
