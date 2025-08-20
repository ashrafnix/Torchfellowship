// server.js

// -----------------------------------------------------------------------------
// IMPORTANT: Environment Variable Loading
// This MUST be the very first thing to run so that all other files/modules
// have access to the environment variables.
// -----------------------------------------------------------------------------
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debug: Check if environment variables are loaded
console.log('Environment variables loaded:');
console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

// -----------------------------------------------------------------------------
// Module Imports (Now that .env is loaded)
// -----------------------------------------------------------------------------
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import { MongoClient, ObjectId } from 'mongodb';
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
import newConvertsRoutes from './api/newConverts.routes.js';
import volunteerRoutes from './api/volunteer.routes.js';
import blogRoutes from './api/blog.routes.js';
import lightCampusRoutes from './api/lightCampus.routes.js';
import torchKidsRoutes from './api/torchKids.routes.js';

// Direct MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'torch-fellowship';

let db;

async function connectToDatabase() {
    if (db) return db;
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        console.log(`Using MongoDB URI: ${MONGODB_URI ? 'Loaded from .env' : 'Not found in .env'}`);
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not found in .env file');
        }
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('✅ Connected to MongoDB Atlas');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        throw error;
    }
}

export const getDb = () => {
    if (!db) throw new Error('Database not initialized');
    return db;
};



// -----------------------------------------------------------------------------
// Express App Initialization
// -----------------------------------------------------------------------------
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
  }
});
const PORT = process.env.PORT || 8080;

// Socket.IO connection handling
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a-very-secret-key');
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id, 'User ID:', socket.userId);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
  });
  
  socket.on('message-delivered', async (messageId) => {
    try {
      const db = getDb();
      await db.collection('messages').updateOne(
        { _id: new ObjectId(messageId) },
        { $set: { delivered: true } }
      );
      
      const message = await db.collection('messages').findOne({ _id: new ObjectId(messageId) });
      if (message && message.recipientId) {
        const roomId = [message.authorId, message.recipientId].sort().join('-');
        io.to(roomId).emit('message-status-updated', { messageId, delivered: true });
      }
    } catch (error) {
      console.error('Error marking message as delivered:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export const getIo = () => io;


// -----------------------------------------------------------------------------
// Global Middleware
// -----------------------------------------------------------------------------
app.use(helmet()); // Set security HTTP headers

// Enable CORS with specific origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rate Limiter for general API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Body Parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------
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
app.use('/api/new-converts', newConvertsRoutes);
app.use('/api/light-campuses', lightCampusRoutes);
app.use('/api/torch-kids', torchKidsRoutes);

// -----------------------------------------------------------------------------
// Static File Serving (for Production)
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Error Handling
// -----------------------------------------------------------------------------
// Handle all routes that are not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handling middleware
app.use(errorHandler);

// -----------------------------------------------------------------------------
// Server Startup
// -----------------------------------------------------------------------------
async function startServer() {
  try {
    // Connect to database first
    await connectToDatabase();
    
    // Start HTTP server with Socket.IO
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`🔌 Socket.IO server ready for real-time messaging`);
      console.log(`🔍 Debug mode enabled - all requests will be logged`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();