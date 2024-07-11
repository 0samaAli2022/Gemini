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
  const refExists = await redisClient.exists(refreshToken);
  if (!refExists) return next(new APIError('Invalid session', 403));

  const accExists = await redisClient.exists(req.token);
  if (!accExists) return next(new APIError('Invalid session', 403));

  await redisClient.del(refreshToken);
  await redisClient.del(req.token);
  
  res.clearCookie('refreshToken', {
    httpOnly: true,
  });
  res.status(200).json({ status: 'Success', data: 'Logged Out' });
});

export { logout };


