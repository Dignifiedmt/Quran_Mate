// User & Profile Routes
import express from 'express';
import {
  getUsers,
  getUserById,
  updateMe,
  getAvailability,
  updateAvailability,
  getBookmarks,
  addBookmark,
  deleteBookmark
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getUsers);
router.get('/me/availability', authenticateToken, getAvailability);
router.put('/me/availability', authenticateToken, updateAvailability);
router.get('/me/bookmarks', authenticateToken, getBookmarks);
router.post('/me/bookmarks', authenticateToken, addBookmark);
router.delete('/me/bookmarks/:id', authenticateToken, deleteBookmark);
router.put('/me', authenticateToken, updateMe);
router.get('/:id', authenticateToken, getUserById);

export default router;
