
import express from 'express';
import { getCommunityMessages, getAdminMessages, getPrivateMessages, createMessage, markMessageAsDelivered, markMessageAsRead, addReaction } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

router.get('/community', getCommunityMessages);
router.get('/admin', getAdminMessages);
router.get('/private', getPrivateMessages); // Expects ?userId=...
router.post('/', createMessage);
router.patch('/:messageId/delivered', markMessageAsDelivered);
router.patch('/:messageId/read', markMessageAsRead);
router.post('/:messageId/react', addReaction);

export default router;
