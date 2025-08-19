import { getDb } from '../server.js';
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
export const getAllMinistryTeams = async (req, res, next) => {
    try {
        const db = getDb();
        const teams = await db.collection('ministry_teams')
            .find({})
            .sort({ name: 1 })
            .toArray();
        res.status(200).json(teams.map(formatMinistryTeamForClient));
    } catch (error) {
        next(new AppError('Failed to fetch all ministry teams.', 500));
    }
};

export const createMinistryTeam = async (req, res, next) => {
    try {
        const db = getDb();
        const { name, description, photoUrl } = req.body;

        if (!name || !description || !photoUrl) {
            return next(new AppError('Name, description, and photo are required.', 400));
        }

        const newTeam = {
            name,
            description,
            photoUrl,
            isActive: true,
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
        const { name, description, photoUrl, isActive } = req.body;

        if (!ObjectId.isValid(id)) {
            return next(new AppError('Invalid ministry team ID.', 400));
        }

        const db = getDb();
        const updatedFields = { name, description, photoUrl, isActive };

        const result = await db.collection('ministry_teams').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedFields }
        );

        if (result.matchedCount === 0) {
            return next(new AppError('Ministry team not found.', 404));
        }

        const updatedTeam = await db.collection('ministry_teams').findOne({ _id: new ObjectId(id) });
        res.status(200).json(formatMinistryTeamForClient(updatedTeam));
    } catch (error) {
        next(new AppError('Failed to update ministry team.', 500));
    }
};

export const deleteMinistryTeam = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return next(new AppError('Invalid ministry team ID.', 400));
        }

        const db = getDb();
        const result = await db.collection('ministry_teams').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return next(new AppError('Ministry team not found.', 404));
        }

        res.status(200).json({ message: 'Ministry team deleted successfully.' });
    } catch (error) {
        next(new AppError('Failed to delete ministry team.', 500));
    }
};