import asyncHandler from 'express-async-handler';
import APIError from '../../utils/APIError.js';
import { redisClient } from '../../config/Redis/redisClient.js';

/**
 * @desc    Users logout
 * @method  get
 * @route   /api/v1/auth/logout
 * @access  public
 */
const logout = asyncHandler(async (req, res, next) => {
  const refreshToken = req?.cookies?.refreshToken;
  if (!refreshToken) return next(new APIError('You are not logged-In', 403));
  const exists = await redisClient.exists(refreshToken);
  if (!exists) return next(new APIError('Invalid session', 403));
  await redisClient.del(refreshToken);
  res.clearCookie('refreshToken', {
    httpOnly: true,
  });
  res.status(200).json({ status: 'Success', data: 'Logged Out' });
});

export { logout };
