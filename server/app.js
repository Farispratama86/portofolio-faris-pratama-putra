import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import experienceRoutes from './routes/experiences.js';
import uploadRoutes from './routes/upload.js';
import profileRoutes from './routes/profile.js';
import certificateRoutes from './routes/certificates.js';
import skillRoutes from './routes/skills.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'portofolio-faris-fullstack' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/skills', skillRoutes);

// Layani hasil build React (dist/) jika sudah di-build
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(400).json({ error: err.message || 'Terjadi kesalahan pada permintaan.' });
});

export default app;
