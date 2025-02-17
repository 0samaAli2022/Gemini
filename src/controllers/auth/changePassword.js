import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import APIError from '../../utils/APIError.js';
import { comparePassword, hashPassword } from '../../utils/hashingPassword.js';
import {
  redisClient,
  deleteTokensForUser,
} from '../../config/Redis/redisClient.js';
const prisma = new PrismaClient();

/**
 * @desc    user can change his password
 * @method  PATCH
 * @route   /api/v1/auth/change-password
 * @access  public
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword === newPassword)
    return next(new APIError('Old and new password cannot be same', 400));
  const matched = await comparePassword(oldPassword, req.user.password);
  if (!matched) return next(new APIError('Old password is not correct', 400));
  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      password: await hashPassword(newPassword),
    },
  });
  await deleteTokensForUser(req.user.id);
  res
    .status(200)
    .json({ status: 'Success', message: 'Your password has been changed.' });
});
export { changePassword };
