// Express Application Configuration
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import partnerRequestRoutes from './routes/partnerRequestRoutes.js';
import partnershipRoutes from './routes/partnershipRoutes.js';
import quranRoutes from './routes/quranRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import trackerRoutes from './routes/trackerRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import groupRoutes from './routes/groupRoutes.js';

export function createApp() {
  const app = express();

  // Standard middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Quran Mate 🌙 API',
      timestamp: new Date().toISOString()
    });
  });

  // Mount REST API endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/partner-requests', partnerRequestRoutes);
  app.use('/api/partnerships', partnershipRoutes);
  app.use('/api/quran', quranRoutes);
  app.use('/api/images', imageRoutes);
  app.use('/api/tracker', trackerRoutes);
  app.use('/api/sessions', sessionRoutes);
  app.use('/api/groups', groupRoutes);

  return app;
}
