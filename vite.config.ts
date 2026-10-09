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
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 200;
                return res.end(content);
              } catch (e) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: 'Failed to read data' }));
              }
            }
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 404;
            return res.end(JSON.stringify({ message: 'No saved site data yet' }));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                fs.writeFileSync(dataFile, JSON.stringify(parsed, null, 2), 'utf-8');
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, siteData: parsed }));
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
