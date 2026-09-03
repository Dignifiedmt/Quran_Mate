// Partnership, Check-in & Message Routes
import express from 'express';
import {
  getCurrentPartnership,
  toggleCheckin,
  endPartnership
} from '../controllers/partnershipController.js';
import {
  getMessages,
  sendMessage
} from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/current', authenticateToken, getCurrentPartnership);
router.post('/:id/checkins', authenticateToken, toggleCheckin);
router.post('/:id/end', authenticateToken, endPartnership);

// Messages endpoints
router.get('/:id/messages', authenticateToken, getMessages);
router.post('/:id/messages', authenticateToken, sendMessage);

export default router;
