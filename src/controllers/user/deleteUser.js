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
    include: {
      profile: true,
    },
  });
  // Remove password and tokens from output
  const propertiesToHide = [
    'password',
    'passwordChangedAt',
    'passwordResetToken',
    'passwordResetTokenExpire',
    'passwordResetTokenVerified',
    'emailVerificationToken',
    'createdAt',
    'updatedAt',
  ];
  propertiesToHide.forEach((property) => (deletedUser[property] = undefined));
  deletedUser.profile.photo = cloudinary.v2.url(deletedUser.profile.photo);
  res.status(200).json({
    status: 'Success',
    data: { deletedUser },
  });
});
export { deleteUser };
