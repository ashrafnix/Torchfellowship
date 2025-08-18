
import { getDb } from '../db/index.js';
import { ObjectId } from 'mongodb';
import AppError from '../utils/AppError.js';

const formatMinistryTeamForClient = (team) => {
    if (!team) return null;
    const { _id, ...rest } = team;
    return {
        _id: _id.toHexString(),
        ...rest
    };
};

// --- PUBLIC ---
export const getPublicMinistryTeams = async (req, res, next) => {
    try {
        const db = getDb();
        const teams = await db.collection('ministry_teams')
            .find({ isActive: true })
            .sort({ name: 1 })
            .toArray();
        res.status(200).json(teams.map(formatMinistryTeamForClient));
    } catch (error) {
        next(new AppError('Failed to fetch ministry teams.', 500));
    }
};

// --- ADMIN ---
export const getAllMinistryTeams = async (req, res, next) => {
    try {
        const db = getDb();
        const teams = await db.collection('ministry_teams').find({}).sort({ name: 1 }).toArray();
        res.status(200).json(teams.map(formatMinistryTeamForClient));
    } catch (error) {
        next(new AppError('Failed to fetch ministry teams for admin.', 500));
    }
};

export const createMinistryTeam = async (req, res, next) => {
    try {
        const { name, description, leaderName, contactEmail, imageUrl, isActive } = req.body;
        if (!name || !description || !leaderName || !contactEmail || !imageUrl) {
            return next(new AppError('All fields including image are required.', 400));
        }

        const db = getDb();
        const newTeam = {
            name,
            description,
            leaderName,
            contactEmail,
            imageUrl,
            isActive: isActive !== false, // default to true
            createdAt: new Date().toISOString(),
        };

        const result = await db.collection('ministry_teams').insertOne(newTeam);
        const createdTeam = { ...newTeam, _id: result.insertedId };
        
        res.status(201).json(formatMinistryTeamForClient(createdTeam));
    } catch (error) {
        next(new AppError('Failed to create ministry team.', 500));
    }
};

export const updateMinistryTeam = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, leaderName, contactEmail, imageUrl, isActive } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (leaderName) updateData.leaderName = leaderName;
        if (contactEmail) updateData.contactEmail = contactEmail;
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (isActive !== undefined) updateData.isActive = isActive;

        if (Object.keys(updateData).length === 0) {
            return next(new AppError('No update data provided.', 400));
        }

        const db = getDb();
        const result = await db.collection('ministry_teams').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        
        if (!result.value) return next(new AppError('Ministry team not found.', 404));

        res.status(200).json(formatMinistryTeamForClient(result.value));
    } catch (error) {
        next(new AppError('Failed to update ministry team.', 500));
    }
};

export const deleteMinistryTeam = async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = getDb();
        // Future enhancement: Delete image from Cloudinary
        const result = await db.collection('ministry_teams').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return next(new AppError('Ministry team not found.', 404));
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete ministry team.', 500));
    }
};