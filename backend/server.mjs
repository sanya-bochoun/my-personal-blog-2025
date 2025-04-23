import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

import { testConnection } from './utils/db.mjs';
import routes from './routes/index.mjs';
import { errorHandler } from './middleware/errorHandler.mjs';
import { notFoundHandler } from './middleware/notFoundHandler.mjs';
import notificationRoutes from './routes/notificationRoutes.mjs';
import adminArticleRoutes from './routes/admin/articleRoutes.mjs';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ทดสอบการเชื่อมต่อกับฐานข้อมูล
testConnection();

// Security Middleware
// 1. Helmet - ตั้งค่า HTTP headers เพื่อความปลอดภัย
app.use(helmet());

// 2. Rate Limiting - ป้องกัน brute force และ DOS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 100, // จำกัด 100 requests ต่อ IP ใน 15 นาที
  standardHeaders: true,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// 3. Data Sanitization - ป้องกัน XSS attacks
app.use(xss());

// CORS
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:3000',  // Alternative dev port
      process.env.FRONTEND_URL  // Production URL
    ].filter(Boolean); // กรองค่า null/undefined ออก
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: '10kb' })); // จำกัดขนาด request body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serving static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ลงทะเบียน API routes
app.use('/api', routes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/articles', adminArticleRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running...',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// API Health Check
app.get('/api/health', async (req, res) => {
  try {
    // ทดสอบการเชื่อมต่อกับฐานข้อมูล
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

// Global Error Handler
app.use(errorHandler);
app.use(notFoundHandler);

// เริ่มต้น server
app.listen(PORT, () => {
  console.log(`✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
🌈 🚀 Server is running successfully! 🚀 🌈
🔹 Environment: ${process.env.NODE_ENV}
🔹 Port: ${PORT}
🔹 Status: Online and ready!
🔹 URLs: http://localhost:${PORT}
🔹 API: http://localhost:${PORT}/api
🔹 Health Check: http://localhost:${PORT}/api/health
🔹 Time: ${new Date().toLocaleString()}
🌟 Happy coding! 💻 ✨
✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`);
}); 