// Image Generation Routes
import { Router } from 'express';
import { generateImage } from '../controllers/imageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Route for generating Quran reflection visuals / study cards
router.post('/generate', authenticateToken, generateImage);

export default router;
