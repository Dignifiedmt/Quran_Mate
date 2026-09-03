// Daily Study Tracker Routes
import express from 'express';
import {
  getTrackerSummary,
  getTrackerLogs,
  createTrackerLog,
  deleteTrackerLog
} from '../controllers/trackerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', authenticateToken, getTrackerSummary);
router.get('/logs', authenticateToken, getTrackerLogs);
router.post('/logs', authenticateToken, createTrackerLog);
router.delete('/logs/:id', authenticateToken, deleteTrackerLog);

export default router;
