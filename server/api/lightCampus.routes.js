
import express from 'express';
import { 
    getPublicCampuses,
    applyForCampus,
    getAllCampusesAdmin,
    createCampusAdmin,
    updateCampusAdmin,
    deleteCampusAdmin,
    getAllApplicationsAdmin,
    approveApplicationAdmin,
    rejectApplicationAdmin
} from '../controllers/lightCampus.controller.js';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- PUBLIC & AUTHENTICATED ROUTES ---
router.get('/public', getPublicCampuses);
router.post('/apply', authMiddleware, applyForCampus);


// --- ADMIN-ONLY ROUTES ---
const adminRouter = express.Router();
adminRouter.use(authMiddleware, adminOnly);

// Manage Campuses
adminRouter.get('/all', getAllCampusesAdmin);
adminRouter.post('/', createCampusAdmin);
adminRouter.put('/:id', updateCampusAdmin);
adminRouter.delete('/:id', deleteCampusAdmin);

// Manage Applications
adminRouter.get('/applications', getAllApplicationsAdmin);
adminRouter.put('/applications/:id/approve', approveApplicationAdmin);
adminRouter.put('/applications/:id/reject', rejectApplicationAdmin);

router.use('/admin', adminRouter);

export default router;
