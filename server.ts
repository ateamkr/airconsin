import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable large JSON payload for custom logo and photos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'site-data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to safely read current site data
function readStoredSiteData(): Record<string, any> | null {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      if (content && content.trim().length > 0) {
        return JSON.parse(content);
      }
    }
  } catch (error) {
    console.warn('Failed to read DATA_FILE, attempting recovery:', error);
  }
  return null;
}

// API: GET site data
app.get('/api/site-data', (_req, res) => {
  try {
    const stored = readStoredSiteData();
    if (stored) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).json(stored);
    }
    // Return empty 200 or null so client can supply its initial default data
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ empty: true });
  } catch (error) {
    console.error('Error reading site data:', error);
    return res.status(500).json({ error: 'Failed to read site data' });
  }
});

// API: POST update site data
app.post('/api/site-data', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ error: 'Invalid site data payload' });
    }

    const existing = readStoredSiteData() || {};
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

    // Keep arrays directly if incoming has them
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

    // Atomically write file
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(merged, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ success: true, siteData: merged, updatedAt: merged.updatedAt });
  } catch (error) {
    console.error('Error saving site data:', error);
    return res.status(500).json({ error: 'Failed to save site data' });
  }
});

// API: POST reset site data to defaults
app.post('/api/site-data/reset', (_req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error resetting site data:', error);
    return res.status(500).json({ error: 'Failed to reset site data' });
  }
});

// Error handling middleware for oversized payloads or malformed JSON
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Express server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Mount Vite in development or serve static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
