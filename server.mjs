const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
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

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app; 