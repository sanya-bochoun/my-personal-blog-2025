import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.mjs';
import { authenticateToken } from '../middleware/auth.mjs';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword
} from '../controllers/userController.mjs';

const router = express.Router();

// Validation middleware
const profileValidation = [
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('bio').optional().trim()
];

const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, profileValidation, validateRequest, updateProfile);
router.post('/avatar', authenticateToken, uploadAvatar);
router.put('/password', authenticateToken, passwordValidation, validateRequest, changePassword);

export default router; 