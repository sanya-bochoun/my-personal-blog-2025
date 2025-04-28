const express = require('express');
const { createServer } = require('@vercel/node');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes & middleware (เปลี่ยน path เป็น CommonJS)
const routes = require('../routes/index.mjs');
const notificationRoutes = require('../routes/notificationRoutes.mjs');
const adminArticleRoutes = require('../routes/admin/articleRoutes.mjs');
const articleRoutes = require('../routes/articleRoutes.mjs');
const likeRoutes = require('../routes/likeRoutes.mjs');
const errorHandler = require('../middleware/errorHandler.mjs');
const notFoundHandler = require('../middleware/notFoundHandler.mjs');

const app = express();

// Security Middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}));
app.use(xss());
app.use(cors({
  origin: [
    'https://my-personal-blog-2025-airo.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Register routes
app.use('/api', routes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/articles', adminArticleRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/likes', likeRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'API is running...',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler);

module.exports = createServer(app); 