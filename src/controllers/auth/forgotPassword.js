import asyncHandler from 'express-async-handler';
import APIError from '../../utils/APIError.js';
import { sendEmailToUser } from '../../config/Nodemailer/nodemailer.js';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) return next(new APIError('Email not found', 404));
  const resetToken = crypto.randomBytes(64).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      passwordResetToken: hashedToken,
      passwordResetTokenExpire: String(Date.now() + 15 * 60 * 1000),
    },
  });
  const info = {
    from: `Mailer Company`,
    to: email,
    subject: 'PasswordResetToken',
    text: 'Now you can reset you password.',
    htm: `<h1>Password reset </h1>
          <p>Here is your password reset token:  ${resetToken}</p>
          <p>If you did not request a password reset, please ignore this email.</p>`,
  };
  await sendEmailToUser(info);
  res.status(200).json({
    status: 'Success',
    message: 'Password reset code has been sent. Please check your email.',
  });
});

export { forgotPassword };
