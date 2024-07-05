import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';
const prisma = new PrismaClient();

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await prisma.user.findMany({
    include: {
      profile: {
        select: {
          photo: true,
          bio: true,
        },
      },
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
  users.forEach((user) => {
    propertiesToHide.forEach((property) => (user[property] = undefined));
    user.profile.photo = cloudinary.v2.url(user.profile.photo);
  });
  res.status(200).json({ status: 'Success', data: { users } });
});

const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      profile: {
        select: {
          photo: true,
          bio: true,
        },
      },
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
  propertiesToHide.forEach((property) => (user[property] = undefined));
  user.profile.photo = cloudinary.v2.url(user.profile.photo);
  res.status(200).json({ status: 'Success', data: { user } });
});

export { getAllUsers, getUser };
