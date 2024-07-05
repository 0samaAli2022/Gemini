import { check } from 'express-validator';
import { validationMiddleware } from '../../middleware/validation.middleware.js';

const updateUserValidator = [
  check('name')
    .optional()
    .isLength({ min: 5 })
    .withMessage('Name should be at least 5 characters')
    .isLength({ max: 50 })
    .withMessage('Name can be 50 characters at most.'),
  check('role')
    .optional()
    .custom((value) => {
      if (!['ADMIN', 'USER'].includes(value)) {
        throw new Error('Invalid role');
      }
      return true;
    }),
  check('isActive')
    .optional()
    .custom((value) => {
      if (typeof value !== 'boolean') {
        throw new Error('Invalid isActive value, must be boolean');
      }
      return true;
    }),
  check('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio can be 500 characters at most'),
  validationMiddleware,
];

export { updateUserValidator };
