// Express Application Configuration
import zlib from 'zlib';
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

  // Lightweight gzip compression for JSON responses > 1KB
  app.use((req, res, next) => {
    const origJson = res.json.bind(res);
    res.json = (body) => {
      const acceptEncoding = req.headers['accept-encoding'] || '';
      if (acceptEncoding.includes('gzip')) {
        const jsonStr = JSON.stringify(body);
        if (jsonStr && jsonStr.length > 1024) {
          const compressed = zlib.gzipSync(jsonStr);
          res.setHeader('Content-Encoding', 'gzip');
          res.setHeader('Vary', 'Accept-Encoding');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          return res.send(compressed);
        }
      }
      return origJson(body);
    };
    next();
  });

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
