import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import Category from './models/Category.js';
import { seedDatabase } from './seeder.js';

import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Middleware to ensure DB connection on serverless/local
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error('[LEO DB] Request DB connection error:', err.message);
    next();
  }
});

// Non-blocking initialization for local development
const initServer = async () => {
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      const categoryCount = await Category.countDocuments();
      if (categoryCount === 0) {
        console.log('[LEO SERVER] Database is empty. Seeding initial catalog data...');
        await seedDatabase();
        console.log('[LEO SERVER] Initial catalog data seeded successfully.');
      }
    }
  } catch (seedErr) {
    console.warn('[LEO SERVER] Auto-seeding check warning:', seedErr.message);
  }
};

if (!process.env.VERCEL) {
  initServer();
}

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev
    }
  },
  credentials: true,
}));

// Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve Static Uploads
try {
  const uploadsPath = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));
} catch (uploadErr) {
  // Read-only filesystem in serverless environments
}

// API Routes
const registerRoutes = (prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/products`, productRoutes);
  app.use(`${prefix}/categories`, categoryRoutes);
  app.use(`${prefix}/collections`, collectionRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/payment`, paymentRoutes);
  app.use(`${prefix}/coupons`, couponRoutes);
  app.use(`${prefix}/reviews`, reviewRoutes);
  app.use(`${prefix}/banners`, bannerRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/upload`, uploadRoutes);
  app.get(`${prefix}/health`, (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      brand: 'LEO Atelier',
      version: '1.0.0',
      mode: process.env.NODE_ENV || 'development',
    });
  });
};

registerRoutes('/api');
registerRoutes('');

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const isDirectRun = process.argv && process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server'));

if (isDirectRun && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[LEO SERVER] Atelier API server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

export default app;
