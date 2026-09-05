// Quran Mate 🌙 Full-Stack Server Entry Point
import path from 'path';
import http from 'http';
import express from 'express';
import { fileURLToPath } from 'url';
import { createApp } from './server/app.js';
import { getDb } from './server/database/database.js';
import { seedDatabase } from './server/database/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const HOST = '0.0.0.0';

async function startServer() {
  // 1. Initialize SQLite database & seed demo users
  try {
    await getDb();
    await seedDatabase();
    console.log('Quran Mate SQLite database initialized & verified.');
  } catch (err) {
    console.error('Database initialization error:', err);
  }

  // 2. Instantiate Express App and HTTP server
  const app = createApp();
  const server = http.createServer(app);

  // 3. Mount Frontend Handling (Vite in Dev, Static Files in Production)
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 4. Start HTTP Server
  server.listen(PORT, HOST, () => {
    console.log(`Quran Mate 🌙 server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
