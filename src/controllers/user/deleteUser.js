import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
import { deleteTokensForUser } from '../../config/Redis/redisClient.js';
import { comparePassword } from '../../utils/hashingPassword.js';
const prisma = new PrismaClient();

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password) return next(new APIError('Password is required', 400));
  console.log(req.user);
  console.log(password, req.user.password);
  const matched = await comparePassword(password, req.user.password);
  if (!matched) return next(new APIError('Wrong password', 400));
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) return next(new APIError('User not found', 404));
  await prisma.user.delete({
    where: {
      id: id,
    },
  });
  await deleteTokensForUser(id);
  res.status(200).json({
    status: 'Success',
    message: 'User has been deleted',
  });
});
export { deleteUser };
