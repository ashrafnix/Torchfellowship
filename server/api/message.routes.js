
import express from 'express';
import { getCommunityMessages, getPrivateMessages, createMessage } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All message routes require authentication
router.use(authMiddleware);

router.get('/community', getCommunityMessages);
router.get('/private', getPrivateMessages); // Expects ?userId=...
router.post('/', createMessage);

export default router;
