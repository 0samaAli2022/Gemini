import asyncHandler from 'express-async-handler';
import APIError from '../../utils/APIError.js';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const verifyResetPassword = asyncHandler(async (req, res, next) => {
  const token = req.query?.token;
  const hashToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashToken,
    },
  });
  if (!user || user.passwordResetTokenExpire < Date.now())
    return next(new APIError('Invalid/Expired reset password token.', 400));
  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      passwordResetToken: null,
      passwordResetTokenExpire: null,
      passwordResetTokenVerfied: true,
    },
  });
  res.status(200).json({ message: 'Password reset token verified.' });
});
export { verifyResetPassword };
