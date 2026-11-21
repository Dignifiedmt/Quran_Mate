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

// Optional authentication for browsing public directory/room preview
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

// Require sign-in to join, create, post, or claim Juz in a Study Circle
function requireCircleAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    return res.status(401).json({ error: 'Please sign in to join the study circle.' });
  }
  return authenticateToken(req, res, next);
}

// Public read routes
router.get('/', optionalAuth, getGroups);
router.get('/:id', optionalAuth, getGroupById);

// Authenticated Study Circle participation routes
router.post('/', requireCircleAuth, createGroup);
router.post('/:id/join', requireCircleAuth, joinGroup);
router.post('/:id/leave', requireCircleAuth, leaveGroup);
router.post('/:id/messages', requireCircleAuth, postGroupMessage);
router.post('/:id/khatmah', requireCircleAuth, updateGroupKhatmah);

export default router;
