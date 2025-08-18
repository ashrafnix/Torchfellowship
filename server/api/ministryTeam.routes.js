
import express from 'express';
import { 
    getPublicMinistryTeams, 
    getAllMinistryTeams, 
    createMinistryTeam, 
    updateMinistryTeam, 
    deleteMinistryTeam 
} from '../controllers/ministryTeam.controller.js';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/public', getPublicMinistryTeams);


// --- ADMIN-ONLY ROUTES ---
router.get('/admin', authMiddleware, adminOnly, getAllMinistryTeams);
router.post('/', authMiddleware, adminOnly, createMinistryTeam);
router.put('/:id', authMiddleware, adminOnly, updateMinistryTeam);
router.delete('/:id', authMiddleware, adminOnly, deleteMinistryTeam);


export default router;