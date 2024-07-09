import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
const prisma = new PrismaClient();

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) return next(new APIError('User not found', 404));
  const deletedUser = await prisma.user.delete({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      profile: {
        select: {
          photo: true,
        },
      },
    },
  });
  deletedUser.profile.photo =
    process.env.CLOUD_IMG_URL + deletedUser.profile.photo;
  // Remove password and tokens from output
  res.status(200).json({
    status: 'Success',
    data: { user: deletedUser },
  });
});
export { deleteUser };
