const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');

// Auth routes
router.use('/auth', authRoutes);

// Post routes
router.use('/posts', postRoutes);

// สำหรับเส้นทาง API อื่นๆ ที่จะเพิ่มในอนาคต
// router.use('/users', userRoutes);

module.exports = router; 