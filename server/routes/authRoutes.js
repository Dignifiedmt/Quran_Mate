// Auth Routes
import express from 'express';
import { register, login, demoLogin, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.get('/me', authenticateToken, getMe);

export default router;
