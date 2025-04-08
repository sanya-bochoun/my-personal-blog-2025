const express = require('express');
const router = express.Router();
const { registerRules, loginRules, refreshTokenRules, validate } = require('../middleware/validateMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Routes
router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.get('/me', authenticateToken, authController.getProfile);
router.post('/refresh-token', refreshTokenRules, validate, authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router; 