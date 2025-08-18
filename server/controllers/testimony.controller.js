
import { getDb } from '../db/index.js';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';

const formatTestimonyForClient = (testimony) => {
    if (!testimony) return null;
    return {
        _id: testimony._id.toHexString(),
        created_at: testimony.created_at,
        name: testimony.name,
        title: testimony.title,
        story_text: testimony.story_text,
        is_approved: testimony.is_approved,
    };
};

// --- PUBLIC-FACING CONTROLLERS ---

export const getPublicTestimonies = async (req, res, next) => {
    try {
        const db = getDb();
        const testimonies = await db.collection('testimonies')
            .find({ is_approved: true })
            .sort({ created_at: -1 })
            .toArray();
        res.status(200).json(testimonies.map(formatTestimonyForClient));
    } catch (error) {
        next(new AppError('Failed to fetch public testimonies.', 500));
    }
};

export const createTestimony = async (req, res, next) => {
    try {
        const db = getDb();
        const { name, title, story_text } = req.body;
        
        if (!name || !title || !story_text) {
             return next(new AppError('Name, title, and story text are required.', 400));
        }

        const newTestimony = { 
            name,
            title,
            story_text,
            is_approved: false, // Default to not approved, requires admin review
            created_at: new Date().toISOString(),
        };
        const result = await db.collection('testimonies').insertOne(newTestimony);
        const createdTestimony = { ...newTestimony, _id: result.insertedId };
        res.status(201).json({ message: "Testimony submitted successfully for review.", newTestimony: formatTestimonyForClient(createdTestimony)});
    } catch (error) {
        next(new AppError('Failed to submit testimony.', 500));
    }
};


// --- ADMIN-ONLY CONTROLLERS ---

export const getAllTestimonies = async (req, res, next) => {
    try {
        const db = getDb();
        const testimonies = await db.collection('testimonies').find({}).sort({ created_at: -1 }).toArray();
        res.status(200).json(testimonies.map(formatTestimonyForClient));
    } catch (error) {
        next(new AppError('Failed to fetch testimonies.', 500));
    }
};

export const updateTestimony = async (req, res, next) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const { is_approved } = req.body;
        
        const finalUpdateData = {};

        if (typeof is_approved === 'boolean') {
            finalUpdateData.is_approved = is_approved;
        } else {
            return next(new AppError('Invalid update data. Only `is_approved` (boolean) is allowed.', 400));
        }
        
        const result = await db.collection('testimonies').updateOne({ _id: new ObjectId(id) }, { $set: finalUpdateData });
        if(result.matchedCount === 0) return next(new AppError('Testimony not found', 404));
        res.status(200).json({ message: 'Testimony updated successfully' });
    } catch (error) {
        next(new AppError('Failed to update testimony.', 500));
    }
};

export const deleteTestimony = async (req, res, next) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const result = await db.collection('testimonies').deleteOne({ _id: new ObjectId(id) });
        if(result.deletedCount === 0) return next(new AppError('Testimony not found', 404));
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete testimony.', 500));
    }
};
