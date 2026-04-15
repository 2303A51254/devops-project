import express from 'express';
import {
  deleteAvailabilityOverride,
  getContent,
  getDashboard,
  getPublicContent,
  listAvailabilityOverrides,
  listCustomers,
  updateContent,
  upsertAvailabilityOverride,
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/content/public', getPublicContent);

router.use(protect, requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/customers', listCustomers);
router.get('/availability', listAvailabilityOverrides);
router.post('/availability', upsertAvailabilityOverride);
router.delete('/availability/:id', deleteAvailabilityOverride);
router.get('/content', getContent);
router.put('/content', updateContent);

export default router;
