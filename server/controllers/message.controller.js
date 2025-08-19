import { getDb } from '../server.js';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';

export const getCommunityMessages = async (req, res, next) => {
    try {
        const db = getDb();
        const dbMessages = await db.collection('messages')
            .find({ recipientId: { $exists: false } })
            .sort({ created_at: 1 })
            .limit(100)
            .toArray();
        const messages = dbMessages.map((m) => ({...m, _id: m._id.toHexString()}));
        res.status(200).json(messages);
    } catch (error) {
        next(new AppError('Failed to fetch community messages.', 500));
    }
};

export const getPrivateMessages = async (req, res, next) => {
    try {
        const db = getDb();
        const { userId } = req.query;
        const currentUserId = req.user._id.toHexString();

        if (!userId) {
            return next(new AppError('User ID is required to fetch private messages.', 400));
        }

        const dbMessages = await db.collection('messages').find({
            $or: [
                { authorId: currentUserId, recipientId: userId },
                { authorId: userId, recipientId: currentUserId }
            ]
        }).sort({ created_at: 1 }).toArray();

        const messages = dbMessages.map((m) => ({...m, _id: m._id.toHexString()}));
        res.status(200).json(messages);
    } catch (error) {
        next(new AppError('Failed to fetch private messages.', 500));
    }
};
export const createMessage = async (req, res, next) => {
    try {
        const db = getDb();
        const newMessageData = {
            ...req.body,
            authorId: req.user._id.toHexString(),
            created_at: new Date().toISOString(),
        };

        const result = await db.collection('messages').insertOne(newMessageData);
        const createdMessage = {...newMessageData, _id: result.insertedId.toHexString()};
        res.status(201).json(createdMessage);
    } catch (error) {
        next(new AppError('Failed to send message.', 500));
    }
};