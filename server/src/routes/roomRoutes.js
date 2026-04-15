import express from 'express';
import {
  checkAvailability,
  createRoom,
  deleteRoom,
  getRoomBySlug,
  listRooms,
  updateRoom,
} from '../controllers/roomController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listRooms);
router.get('/availability', checkAvailability);
router.get('/:slug', getRoomBySlug);
router.post('/', protect, requireAdmin, createRoom);
router.put('/:id', protect, requireAdmin, updateRoom);
router.delete('/:id', protect, requireAdmin, deleteRoom);

export default router;
