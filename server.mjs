import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://my-personal-blog-2025-v2-29qx17ikd-sanya-bochouns-projects.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Posts routes
app.get('/api/posts', (req, res) => {
  res.json([]);
});

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  res.status(201).json({
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString()
  });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  res.json([
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Lifestyle' },
    { id: '3', name: 'Travel' }
  ]);
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
export default app; 