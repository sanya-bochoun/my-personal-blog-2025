const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken, checkRole, checkOwnership } = require('../middleware/authMiddleware');

// Public routes (ไม่ต้องล็อกอิน)
router.get('/', postController.getAllPosts);
router.get('/:slug', postController.getPostBySlug);

// Protected routes (ต้องล็อกอิน)
router.post('/', authenticateToken, postController.createPost);
router.put('/:id', authenticateToken, checkOwnership('id', 'posts', 'author_id'), postController.updatePost);
router.delete('/:id', authenticateToken, checkOwnership('id', 'posts', 'author_id'), postController.deletePost);
router.post('/:id/like', authenticateToken, postController.toggleLike);

module.exports = router; 