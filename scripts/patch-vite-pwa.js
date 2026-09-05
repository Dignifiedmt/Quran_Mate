// Patch vite-plugin-pwa for Node 22 compatibility when bundled by Vite
import fs from 'fs';
import path from 'path';

const targetFile = path.resolve('node_modules/vite-plugin-pwa/dist/index.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  let changed = false;

  if (content.includes('createRequire(_dirname)')) {
    content = content.replace('createRequire(_dirname)', 'createRequire(resolve(_dirname))');
    changed = true;
  }

  const oldDirnamePattern = 'const _dirname2 = typeof __dirname !== "undefined" ? __dirname : dirname2(fileURLToPath2(import.meta.url));';
  const newDirnamePattern = 'const _dirname2 = typeof __dirname !== "undefined" && __dirname !== "." ? __dirname : dirname2(fileURLToPath2(import.meta.url));';

  if (content.includes(oldDirnamePattern)) {
    content = content.replace(oldDirnamePattern, newDirnamePattern);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(targetFile, content);
    console.log('[Quran Mate] Successfully patched vite-plugin-pwa for Node 22.');
  }
}
