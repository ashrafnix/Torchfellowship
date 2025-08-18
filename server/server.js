

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { connectToDatabase } from './db/index.js';
import AppError from './utils/AppError.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './api/auth.routes.js';
import userRoutes from './api/users.routes.js';
import teachingRoutes from './api/teaching.routes.js';
import eventRoutes from './api/event.routes.js';
import prayerRequestRoutes from './api/prayerRequest.routes.js';
import siteContentRoutes from './api/siteContent.routes.js';
import messageRoutes from './api/message.routes.js';
import contactMessageRoutes from './api/contactMessage.routes.js';
import aiRoutes from './api/ai.routes.js';
import adminRoutes from './api/admin.routes.js';
import profileRoutes from './api/profile.routes.js';
import cloudinaryRoutes from './api/cloudinary.routes.js';
import leaderRoutes from './api/leader.routes.js';
import testimonyRoutes from './api/testimony.routes.js';
import ministryTeamRoutes from './api/ministryTeam.routes.js';
import volunteerRoutes from './api/volunteer.routes.js';
import blogRoutes from './api/blog.routes.js';
import lightCampusRoutes from './api/lightCampus.routes.js';
import torchKidsRoutes from './api/torchKids.routes.js';


// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB database
connectToDatabase();

// --- GLOBAL MIDDLEWARE ---
// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate Limiter for general API requests
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);


app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/leaders', leaderRoutes);
app.use('/api/testimonies', testimonyRoutes);
app.use('/api/teachings', teachingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/prayer-requests', prayerRequestRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact-messages', contactMessageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ministry-teams', ministryTeamRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/light-campuses', lightCampusRoutes);
app.use('/api/torch-kids', torchKidsRoutes);


// --- STATIC FILE SERVING FOR REACT APP ---
// Temporarily commented out until frontend is built
// const clientPath = path.join(__dirname, '..', 'dist');
// app.use(express.static(clientPath));

// For any route that is not an API route, serve the React app's index.html
// app.get('*', (req, res, next) => {
//     // Check if the request is for an API endpoint
//     if (req.originalUrl.startsWith('/api/')) {
//         return next(new AppError('API endpoint not found', 404));
//     }
//     res.sendFile(path.resolve(clientPath, 'index.html'));
// });


// --- ERROR HANDLING ---

// Handle all routes that are not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handling middleware
app.use(errorHandler);


// --- SERVER STARTUP ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});