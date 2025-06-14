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
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { testConnection } from './utils/db.mjs';
import routes from './routes/index.mjs';
import { errorHandler } from './middleware/errorHandler.mjs';
import { notFoundHandler } from './middleware/notFoundHandler.mjs';
import notificationRoutes from './routes/notificationRoutes.mjs';
import adminArticleRoutes from './routes/admin/articleRoutes.mjs';
import articleRoutes from './routes/articleRoutes.mjs';
import likeRoutes from './routes/likeRoutes.mjs';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Test database connection
testConnection();

// Security Middleware
// 1. Helmet - Set HTTP headers for security
app.use(helmet());

// 2. Rate Limiting - Prevent brute force and DOS attacks
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit 100 requests per IP in 15 minutes
  message: 'Too many requests from this IP, please try again later.'
}));

// 3. Data Sanitization - Prevent XSS attacks
app.use(xss());

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://my-personal-blog-2025-v2-b03a5shxx-sanya-bochouns-projects.vercel.app',
    process.env.FRONTEND_URL,
    /\.vercel\.app$/
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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

// Basic routes for testing
app.get('/api', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  res.json([
    { id: '1', name: 'Technology', slug: 'technology' },
    { id: '2', name: 'Lifestyle', slug: 'lifestyle' },
    { id: '3', name: 'Travel', slug: 'travel' }
  ]);
});

// Posts routes
app.get('/api/posts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  
  const posts = [
    {
      id: '1',
      title: 'Getting Started with Web Development',
      content: 'Learn the basics of web development...',
      category: 'Technology',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Travel Tips for Digital Nomads',
      content: 'Essential tips for working while traveling...',
      category: 'Travel',
      createdAt: new Date().toISOString()
    }
  ];

  res.json({
    posts,
    pagination: {
      page,
      limit,
      total: posts.length,
      totalPages: Math.ceil(posts.length / limit)
    }
  });
});

// Global Error Handler
app.use(errorHandler);
app.use(notFoundHandler);

// สร้าง HTTP server จาก express app
const server = http.createServer(app);

// ตั้งค่า socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
  }
});

// ตัวอย่าง event สำหรับ dev/debug
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// เริ่มต้น server (สำหรับ local development)
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n🌈 🚀 Server is running successfully! 🚀 🌈\n🔹 Environment: ${process.env.NODE_ENV}\n🔹 Port: ${PORT}\n🔹 Status: Online and ready!\n🔹 URLs: http://localhost:${PORT}\n🔹 API: http://localhost:${PORT}/api\n🔹 Health Check: http://localhost:${PORT}/api/health\n🔹 Time: ${new Date().toLocaleString()}\n🌟 Happy coding! 💻 ✨\n✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨`);
  });
}

// Export สำหรับ Vercel
export default app;
export { io }; 