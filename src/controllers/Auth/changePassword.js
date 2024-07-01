import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import { hashPassword } from '../../utils/hashingPassword.js';
const prisma = new PrismaClient();

/**
 * @desc    user can change his password
 * @method  PATCH
 * @route   /api/v1/auth/change-password
 * @access  public
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const user = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      password: await hashPassword(password),
    },
  });
  res
    .status(200)
    .json({ status: 'Success', message: 'Your password has been changed.' });
});
export { changePassword };
