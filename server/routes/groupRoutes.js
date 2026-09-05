import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js';
import {
  getGroups,
  getGroupById,
  createGroup,
  joinGroup,
  leaveGroup,
  postGroupMessage,
  updateGroupKhatmah
} from '../controllers/groupController.js';

const router = express.Router();

// Optional authentication for listing
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err && user) {
      req.user = user;
    }
    next();
  });
}

// Routes
router.get('/', optionalAuth, getGroups);
router.get('/:id', optionalAuth, getGroupById);

// Public / open room actions (supports both authenticated users and guests)
router.post('/', optionalAuth, createGroup);
router.post('/:id/join', optionalAuth, joinGroup);

// Member routes
router.post('/:id/leave', authenticateToken, leaveGroup);
router.post('/:id/messages', optionalAuth, postGroupMessage);
router.post('/:id/khatmah', optionalAuth, updateGroupKhatmah);

export default router;
