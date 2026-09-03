// Quran API Routes
import express from 'express';
import {
  getAyahByReference,
  searchAyahs,
  getSurahs,
  getSurahByNumber,
  getRandomAyah
} from '../controllers/quranController.js';

const router = express.Router();

router.get('/random', getRandomAyah);
router.get('/surahs', getSurahs);
router.get('/surah/:number', getSurahByNumber);
router.get('/search', searchAyahs);
router.get('/ayah/:reference', getAyahByReference);

export default router;
