import { getDb } from '../db/index.js';
import AppError from '../utils/AppError.js';

const defaultContent = {
    heroTitle: "Welcome to Torch Kids",
    heroSubtitle: "A fun, safe, and engaging environment for your children to grow in their faith.",
    aboutText: "The Torch Kids environment is designed specifically for children, offering a welcoming and safe space filled with activities to foster a disciple-making journey. They engage children in live worship, skit lessons, videos, interactive Biblical learning, and prayer.",
    safetyText: "Our environment is monitored by security cameras to ensure safety, and all our staff members and volunteers undergo thorough background checks before serving.",
    experienceText: "Torch Kids provides a worship experience for elementary students, instilling the love of God in their themed sanctuary.",
    groupsText: "The program is divided into age groups, ensuring a tailored experience for each child, from toddlers to pre-teens."
};

export const getTorchKidsContent = async (req, res, next) => {
    try {
        const db = getDb();
        const content = await db.collection('torch_kids_content').findOne({});
        
        if (!content) {
            // Return a default structure if no content exists yet
            return res.status(200).json(defaultContent);
        }
        
        const { _id, ...contentData } = content;
        res.status(200).json({ ...defaultContent, ...contentData });
    } catch (error) {
        next(new AppError('Failed to fetch Torch Kids content.', 500));
    }
};

export const updateTorchKidsContent = async (req, res, next) => {
    try {
        const { _id, ...elements } = req.body;
        if (!elements) return next(new AppError('Content elements are required', 400));

        const db = getDb();
        await db.collection('torch_kids_content').updateOne(
            {}, // There's only one document, so the filter is empty
            { $set: elements },
            { upsert: true } // Creates the document if it doesn't exist
        );

        res.status(200).json({ message: 'Content updated successfully' });
    } catch (error) {
        next(new AppError('Failed to update Torch Kids content.', 500));
    }
};