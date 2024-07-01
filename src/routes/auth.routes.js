import express from 'express';
import {
  login,
  register,
  verifyEmail,
  refresh,
  logout,
  forgotPassword,
  verifyResetPassword,
  resetPassword,
  changePassword,
} from '../controllers/Auth/auth.index.js';
import {
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyResetPasswordValidator,
  changePasswordValidator,
  verifyEmailValidator,
  loginValidator,
  registerValidator,
} from '../utils/validation/auth.validator.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/logout', authMiddleware, logout);
router.get('/refresh', refresh);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.patch(
  '/verify-reset-token',
  verifyResetPasswordValidator,
  verifyResetPassword
);
router.patch('/reset-password', resetPasswordValidator, resetPassword);
router.patch(
  '/change-password',
  authMiddleware,
  changePasswordValidator,
  changePassword
);
router.get('/verfiy/:token', verifyEmailValidator, verifyEmail);
export default router;
