import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import fs from 'fs'
import path from 'path'

function syncLocalDataPlugin() {
  return {
    name: 'sync-local-data',
    configureServer(server) {
      server.middlewares.use('/api/sync-localhost-data', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.products && Array.isArray(data.products) && data.products.length > 0) {
                const prodPath = path.resolve(__dirname, 'src/data/products.js');
                fs.writeFileSync(prodPath, `export const PRODUCTS = ${JSON.stringify(data.products, null, 2)};\n`, 'utf-8');
                console.log('[Sync] Updated src/data/products.js with', data.products.length, 'products');
              }
              if (data.businessInfo && typeof data.businessInfo === 'object') {
                const busPath = path.resolve(__dirname, 'src/data/business.js');
                fs.writeFileSync(busPath, `export const BUSINESS_INFO = ${JSON.stringify(data.businessInfo, null, 2)};\n`, 'utf-8');
                console.log('[Sync] Updated src/data/business.js with ABN:', data.businessInfo.abn);
              }
              if (data.users && Array.isArray(data.users) && data.users.length > 0) {
                const usrPath = path.resolve(__dirname, 'src/data/users.js');
                fs.writeFileSync(usrPath, `export const DEFAULT_USERS = ${JSON.stringify(data.users, null, 2)};\n`, 'utf-8');
                console.log('[Sync] Updated src/data/users.js with', data.users.length, 'users');
              }
              const syncRecord = path.resolve(__dirname, 'src/data/last_sync.json');
              fs.writeFileSync(syncRecord, JSON.stringify({ syncedAt: new Date().toISOString(), productsCount: data.products?.length, abn: data.businessInfo?.abn }, null, 2));

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Local storage synchronized to src/data/' }));
            } catch (err) {
              console.error('[Sync Error]', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), syncLocalDataPlugin()],
  base: './', // Ensures assets load properly on GitHub Pages or custom domains
})
