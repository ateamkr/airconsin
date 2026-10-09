import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable large JSON payload for custom logo and photos
app.use(express.json({ limit: '25mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'site-data.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// API: GET site data
app.get('/api/site-data', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return res.json(JSON.parse(content));
    }
    return res.status(404).json({ message: 'No saved site data yet' });
  } catch (error) {
    console.error('Error reading site data:', error);
    return res.status(500).json({ error: 'Failed to read site data' });
  }
});

// API: POST update site data
app.post('/api/site-data', (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return res.json({ success: true, siteData: data });
  } catch (error) {
    console.error('Error saving site data:', error);
    return res.status(500).json({ error: 'Failed to save site data' });
  }
});

// API: POST reset site data to defaults
app.post('/api/site-data/reset', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Error resetting site data:', error);
    return res.status(500).json({ error: 'Failed to reset site data' });
  }
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
