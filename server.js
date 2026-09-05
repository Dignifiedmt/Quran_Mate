// Quran Mate 🌙 Full-Stack Server Entry Point
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import http from 'http';
import express from 'express';
import { fileURLToPath } from 'url';
import { createApp } from './server/app.js';
import { getDb } from './server/database/database.js';
import { seedDatabase } from './server/database/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In Google AI Studio sandbox container, the dev server must bind to port 3000 for internal reverse-proxy routing.
// In external deployments (such as Render where PORT=10000), dynamically bind to process.env.PORT.
const PORT = process.env.APPLET_ID ? 3000 : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
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
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!doctype html><html><body><h1>Quran Mate 🌙 Web Service Ready</h1><p>Static assets are loading. Please refresh.</p></body></html>');
      }
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
