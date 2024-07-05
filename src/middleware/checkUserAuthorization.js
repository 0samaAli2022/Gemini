import asyncHandler from 'express-async-handler';
import APIError from '../utils/APIError.js';

// Middleware to check if the user is authorized to perform the action
const checkUserAuthorization = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'ADMIN') {
    return next();
  }
  const { id } = req.params; // Assuming the user ID is passed in the request parameters
  if (id !== req.user.id) {
    return next(
      new APIError('You are not authorized to perform this action', 403)
    );
  }

  next();
});

export { checkUserAuthorization };
