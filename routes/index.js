const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Auth routes
router.use('/auth', authRoutes);

// สำหรับเส้นทาง API อื่นๆ ที่จะเพิ่มในอนาคต
// router.use('/users', userRoutes);
// router.use('/posts', postRoutes);

module.exports = router; 