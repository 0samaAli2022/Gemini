import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';
import sanitizeUser from '../../utils/sanitization/sanitizeUser.js';

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

  users.forEach((user) => {
    user.profile.photo = cloudinary.v2.url(user.profile.photo);
    // Remove password and tokens from output
    sanitizeUser(user);
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
  user.profile.photo = cloudinary.v2.url(user.profile.photo);
  // Remove password and tokens from output
  sanitizeUser(user);
  res.status(200).json({ status: 'Success', data: { user } });
});

export { getAllUsers, getUser };
