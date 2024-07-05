import { check } from 'express-validator';
import { validationMiddleware } from '../../middleware/validation.middleware.js';

const createPostValidator = [
  check('title')
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ max: 50 })
    .withMessage('Title can be 50 characters at most.'),
  check('content').notEmpty().withMessage('Content is required.'),
  check('privacy')
    .optional()
    .custom((value) => {
      if (!['FOLLOWERS', 'PUBLIC', 'PRIVATE'].includes(value)) {
        throw new Error('Invalid option, must be FOLLOWERS, PUBLIC or PRIVATE');
      }
      return true;
    }),
  validationMiddleware,
];

export { createPostValidator };
