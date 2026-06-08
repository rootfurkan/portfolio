import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './config/database.js';

// Modeller — sync için hepsini import etmemiz gerekiyor
import './models/User.js';
import './models/Profile.js';
import './models/Experience.js';
import './models/Education.js';
import './models/Certificate.js';
import './models/Project.js';

// Routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import projectRoutes from './routes/projects.js';
import experienceRoutes from './routes/experiences.js';
import educationRoutes from './routes/educations.js';
import certificateRoutes from './routes/certificates.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar (fotoğraflar)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/educations', educationRoutes);
app.use('/api/certificates', certificateRoutes);

// Test
app.get('/api/health', (req, res) => {
  res.json({ message: 'API çalışıyor!', time: new Date() });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL bağlantısı başarılı');

    await sequelize.sync({ alter: true });
    console.log('✅ Tablolar hazır');

    app.listen(PORT, () => {
      console.log(`🚀 Server http://localhost:${PORT} adresinde çalışıyor`);
    });
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
};

start();