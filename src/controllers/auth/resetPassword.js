import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { hashPassword } from '../../utils/hashingPassword.js';
import APIError from '../../utils/APIError.js';
const prisma = new PrismaClient();

/**
 * @desc    user can reset his password to another one
 * @method  PATCH
 * @route   /api/v1/auth/reset-password
 */

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user)
    return next(new APIError(`User not find for email: ${email}`, 404));
  if (!user.passwordResetTokenVerified)
    return next(new APIError(`Not verfied reset token`, 400));
  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: await hashPassword(password),
      passwordChangedAt: String(Date.now()),
      passwordResetTokenVerified: null,
    },
  });
  res
    .status(200)
    .json({ status: 'Success', message: 'Your password has been reset.' });
});

export { resetPassword };
