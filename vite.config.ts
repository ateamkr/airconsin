import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function siteDataApiPlugin(): Plugin {
  return {
    name: 'site-data-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        const dataDir = path.resolve(__dirname, 'data');
        const dataFile = path.resolve(dataDir, 'site-data.json');

        if (url === '/api/site-data') {
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }

          if (req.method === 'GET') {
            if (fs.existsSync(dataFile)) {
              try {
                const content = fs.readFileSync(dataFile, 'utf-8');
                if (content && content.trim().length > 0) {
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                  res.statusCode = 200;
                  return res.end(content);
                }
              } catch (e) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: 'Failed to read data' }));
              }
            }
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 200;
            return res.end(JSON.stringify({ empty: true }));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const incoming = JSON.parse(body);
                let existing: Record<string, any> = {};
                if (fs.existsSync(dataFile)) {
                  try {
                    existing = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
                  } catch (e) {}
                }

                const merged = {
                  ...existing,
                  ...incoming,
                  company: { ...(existing.company || {}), ...(incoming.company || {}) },
                  settings: { ...(existing.settings || {}), ...(incoming.settings || {}) },
                  afterService: { ...(existing.afterService || {}), ...(incoming.afterService || {}) },
                  growthTrust: { ...(existing.growthTrust || {}), ...(incoming.growthTrust || {}) },
                  honestEstimate: { ...(existing.honestEstimate || {}), ...(incoming.honestEstimate || {}) },
                  consultationSection: { ...(existing.consultationSection || {}), ...(incoming.consultationSection || {}) },
                  updatedAt: Date.now(),
                };

                if (Array.isArray(incoming.navMenu) && incoming.navMenu.length > 0) {
                  merged.navMenu = incoming.navMenu;
                }
                if (Array.isArray(incoming.heroSlides) && incoming.heroSlides.length > 0) {
                  merged.heroSlides = incoming.heroSlides;
                }
                if (Array.isArray(incoming.stats) && incoming.stats.length > 0) {
                  merged.stats = incoming.stats;
                }
                if (Array.isArray(incoming.reviews) && incoming.reviews.length > 0) {
                  merged.reviews = incoming.reviews;
                }
                if (Array.isArray(incoming.inquiries)) {
                  merged.inquiries = incoming.inquiries;
                }
                if (incoming.mottoSection) {
                  merged.mottoSection = incoming.mottoSection;
                }

                const tempFile = `${dataFile}.tmp.${Date.now()}`;
                fs.writeFileSync(tempFile, JSON.stringify(merged, null, 2), 'utf-8');
                fs.renameSync(tempFile, dataFile);

                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, siteData: merged, updatedAt: merged.updatedAt }));
              } catch (err) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: 'Failed to save site data' }));
              }
            });
            return;
          }
        }

        if (url === '/api/site-data/reset' && req.method === 'POST') {
          if (fs.existsSync(dataFile)) {
            try {
              fs.unlinkSync(dataFile);
            } catch (e) {}
          }
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), siteDataApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
