import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth.mjs';
import { Article } from '../models/Article.mjs';

const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create article
router.post('/', authenticateToken, upload.single('thumbnailImage'), async (req, res) => {
  try {
    const { title, content, categoryId, introduction, status } = req.body;
    const authorId = req.user.id;

    // Validate required fields
    if (!title || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required'
      });
    }

    // Create article data
    const articleData = {
      title,
      content: content || '',
      category_id: parseInt(categoryId),
      author_id: authorId,
      introduction: introduction || '',
      status: status || 'draft',
      thumbnail_image: req.file ? `/uploads/${req.file.filename}` : null
    };

    // Save to database
    const article = await Article.create(articleData);

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create article'
    });
  }
});

export default router; 