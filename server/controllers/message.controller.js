
import { getDb } from '../db/index.js';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';

export const getCommunityMessages = async (req, res, next) => {
    try {
        const db = getDb();
        const dbMessages = await db.collection('messages')
            .find({ recipientId: { $exists: false } }) // Community messages have no recipientId
            .sort({ created_at: 1 })
            .limit(100) // Get last 100 messages
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
        const currentUserId = req.user._id.toHexString();
        const otherUserId = req.query.userId;

        if (!otherUserId) {
            return next(new AppError('User ID for private chat is required.', 400));
        }

        const dbMessages = await db.collection('messages').find({
            $or: [
                { authorId: currentUserId, recipientId: otherUserId },
                { authorId: otherUserId, recipientId: currentUserId }
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
            authorId: req.user._id.toHexString(), // Ensure author is the logged in user
            created_at: new Date().toISOString(),
        };

        const result = await db.collection('messages').insertOne(newMessageData);
        const createdMessage = {...newMessageData, _id: result.insertedId.toHexString()};
        res.status(201).json(createdMessage);
    } catch (error) {
        next(new AppError('Failed to send message.', 500));
    }
};
