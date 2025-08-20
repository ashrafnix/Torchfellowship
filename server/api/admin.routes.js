
import express from 'express';
import { getDashboardStats, getUserGrowthStats } from '../controllers/admin.controller.js';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/stats', authMiddleware, adminOnly, getDashboardStats);
router.get('/user-growth', authMiddleware, adminOnly, getUserGrowthStats);

export default router;
