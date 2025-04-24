import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth.mjs';
import { Article } from '../models/Article.mjs';
import { Category } from '../models/Category.mjs';
import { Op } from 'sequelize';

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

// Get user's articles
router.get('/', authenticateToken, async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: {
        author_id: req.user.id
      },
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      status: 'success',
      data: articles
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch articles'
    });
  }
});

// Search user's articles
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    const articles = await Article.findAll({
      where: {
        author_id: req.user.id,
        title: {
          [Op.like]: `%${q}%`
        }
      },
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      status: 'success',
      data: articles
    });
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to search articles'
    });
  }
});

// Get single article
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article || article.author_id !== req.user.id) {
      return res.status(404).json({
        status: 'error',
        message: 'Article not found'
      });
    }

    res.json({
      status: 'success',
      data: article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch article'
    });
  }
});

// Create article
router.post('/', authenticateToken, upload.single('thumbnailImage'), async (req, res) => {
  try {
    const { title, content, categoryId, introduction, status } = req.body;
    const authorId = req.user.id;

    if (!title || !categoryId) {
      return res.status(400).json({
        status: 'error',
        message: 'Title and category are required'
      });
    }

    const articleData = {
      title,
      content: content || '',
      category_id: parseInt(categoryId),
      author_id: authorId,
      introduction: introduction || '',
      status: status || 'draft',
      thumbnail_image: req.file ? `/uploads/${req.file.filename}` : null
    };

    const article = await Article.create(articleData);

    res.status(201).json({
      status: 'success',
      message: 'Article created successfully',
      data: article
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create article'
    });
  }
});

// Update article
router.put('/:id', authenticateToken, upload.single('thumbnailImage'), async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article || article.author_id !== req.user.id) {
      return res.status(404).json({
        status: 'error',
        message: 'Article not found'
      });
    }

    const { title, content, category_id, introduction, status } = req.body;
    
    const updateData = {
      title: title || article.title,
      content: content || article.content,
      category_id: category_id ? parseInt(category_id) : article.category_id,
      introduction: introduction || article.introduction,
      status: status || article.status,
      thumbnail_image: req.file ? `/uploads/${req.file.filename}` : article.thumbnail_image
    };

    const updatedArticle = await Article.update(article.id, updateData);

    res.json({
      status: 'success',
      message: 'Article updated successfully',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update article'
    });
  }
});

export default router; 