
import express from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/stats', authMiddleware, adminOnly, getDashboardStats);

export default router;
