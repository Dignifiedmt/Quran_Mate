// Partner Request Routes
import express from 'express';
import {
  sendPartnerRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  declineRequest
} from '../controllers/partnerRequestController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, sendPartnerRequest);
router.get('/received', authenticateToken, getReceivedRequests);
router.get('/sent', authenticateToken, getSentRequests);
router.patch('/:id/accept', authenticateToken, acceptRequest);
router.patch('/:id/decline', authenticateToken, declineRequest);

export default router;
