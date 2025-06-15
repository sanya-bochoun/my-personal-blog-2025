import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

import { testConnection } from '../../backend/utils/db.mjs';
import routes from '../../backend/routes/index.mjs';
import { errorHandler } from '../../backend/middleware/errorHandler.mjs';
import { notFoundHandler } from '../../backend/middleware/notFoundHandler.mjs';
import notificationRoutes from '../../backend/routes/notificationRoutes.mjs';
import adminArticleRoutes from '../../backend/routes/admin/articleRoutes.mjs';
import articleRoutes from '../../backend/routes/articleRoutes.mjs';
import likeRoutes from '../../backend/routes/likeRoutes.mjs';

// Load environment variables
dotenv.config();

const app = express();

// Test database connection
testConnection();

// Security Middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));
app.use(xss());

// CORS configuration
const corsOptions = {
  origin: [
    'https://cute-tulumba-db13d6.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API routes
app.use('/api', routes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/articles', adminArticleRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/likes', likeRoutes);

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      status: 'ok',
      timestamp: new Date(),
      dbConnection: dbConnected ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);

// Export for Netlify Functions
export const handler = serverless(app); 