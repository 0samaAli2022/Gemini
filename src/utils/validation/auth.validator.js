import { PrismaClient } from '@prisma/client';
import { check } from 'express-validator';
import { validationMiddleware } from '../../middleware/validation.middleware.js';

const prisma = new PrismaClient();
const registerValidator = [
  check('name')
    .isLength({ min: 5 })
    .withMessage('Name should be at least 5 characters')
    .isLength({ max: 50 })
    .withMessage('Name can be 50 characters at most.'),
  check('email')
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please Enter a valid Email')
    .custom(async (value) => {
      const exists = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (exists) throw new Error('Another user is using this email.');
    }),
  check('password')
    .isLength({
      min: 8,
    })
    .withMessage('Password should be at least 8 characters.')
    .isLength({
      max: 22,
    })
    .withMessage('Password can be 22 characters at most'),
  validationMiddleware,
];

const loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please Enter a valid Email'),
  check('password').notEmpty().withMessage('Password is required'),
  validationMiddleware,
];

const changePasswordValidator = [
  check('newPassword')
    .isLength({
      min: 8,
    })
    .withMessage('Password should be at least 8 characters')
    .isLength({
      max: 22,
    })
    .withMessage('Password can be 22 characters at most'),
  validationMiddleware,
];
const forgotPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please Enter a valid Email')
    .custom(async (value) => {
      const exists = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (!exists) throw new Error('No user is using this email.');
    }),
  validationMiddleware,
];

const resetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please Enter a valid Email')
    .custom(async (value) => {
      const exists = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (!exists) throw new Error('No user is using this email.');
    }),
  check('password')
    .isLength({
      min: 8,
    })
    .withMessage('Password should be at least 8 characters')
    .isLength({
      max: 22,
    })
    .withMessage('Password can be 22 characters at most'),
  validationMiddleware,
];

const verifyResetPasswordValidator = [
  check('token')
    .notEmpty()
    .withMessage('Token is required')
    .isLength({ min: 128 })
    .withMessage('Invalid token')
    .isLength({ max: 128 })
    .withMessage('Invalid token'),
  validationMiddleware,
];

const verifyEmailValidator = [
  check('token').notEmpty().withMessage('Token is required'),
  validationMiddleware,
];
export {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyResetPasswordValidator,
  verifyEmailValidator,
};
