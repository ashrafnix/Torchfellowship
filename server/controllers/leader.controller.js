
import { getDb } from '../db/index.js';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';

const formatLeaderForClient = (leader) => {
    if (!leader) return null;
    const { _id, ...rest } = leader;
    return {
        _id: _id.toHexString(),
        ...rest
    };
};

export const getAllLeaders = async (req, res, next) => {
    try {
        const db = getDb();
        const leaders = await db.collection('leaders').find({}).sort({ createdAt: 1 }).toArray();
        res.status(200).json(leaders.map(formatLeaderForClient));
    } catch (error) {
        next(new AppError('Failed to fetch leaders.', 500));
    }
};

export const createLeader = async (req, res, next) => {
    try {
        const { name, title, bio, photoUrl, youtubeUrl } = req.body;
        if (!name || !title || !bio || !photoUrl || !youtubeUrl) {
            return next(new AppError('All fields including photo are required.', 400));
        }

        const db = getDb();
        const newLeader = {
            name,
            title,
            bio,
            photoUrl,
            youtubeUrl,
            createdAt: new Date().toISOString(),
        };

        const result = await db.collection('leaders').insertOne(newLeader);
        const createdLeader = { ...newLeader, _id: result.insertedId };
        
        res.status(201).json(formatLeaderForClient(createdLeader));
    } catch (error) {
        next(new AppError('Failed to create leader profile.', 500));
    }
};

export const updateLeader = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, title, bio, photoUrl, youtubeUrl } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (title) updateData.title = title;
        if (bio) updateData.bio = bio;
        if (photoUrl) updateData.photoUrl = photoUrl;
        if (youtubeUrl) updateData.youtubeUrl = youtubeUrl;

        if (Object.keys(updateData).length === 0) {
            return next(new AppError('No update data provided.', 400));
        }

        const db = getDb();
        const result = await db.collection('leaders').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        
        if (!result.value) return next(new AppError('Leader not found.', 404));

        res.status(200).json(formatLeaderForClient(result.value));
    } catch (error) {
        next(new AppError('Failed to update leader profile.', 500));
    }
};

export const deleteLeader = async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDb();
        // Future enhancement: Delete image from Cloudinary
        const result = await db.collection('leaders').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return next(new AppError('Leader not found.', 404));
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete leader profile.', 500));
    }
};
