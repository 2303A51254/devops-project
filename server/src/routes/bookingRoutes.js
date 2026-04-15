import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/mine', protect, getMyBookings);
router.get('/', protect, requireAdmin, getAllBookings);
router.patch('/:id', protect, requireAdmin, updateBookingStatus);

export default router;
