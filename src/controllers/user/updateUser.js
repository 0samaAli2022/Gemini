import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';
import sanitizeUser from '../../utils/sanitization/sanitizeUser.js';

const prisma = new PrismaClient();

const updateUser = asyncHandler(async (req, res, next) => {
  const { name, role, isActive, bio } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      profile: true,
    },
  });
  const dataToUpdate = {
    name: name || user.name,
    role: role || user.role,
    isActive: isActive || user.isActive,
    profile: {
      update: {
        photo: req.file ? req.file.filename : user.profile.photo,
        bio: bio || user.profile.bio,
      },
    },
  };

  const updatedUser = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: dataToUpdate,
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

  updatedUser.profile.photo =
    process.env.CLOUD_IMG_URL + updatedUser.profile.photo;
  res.status(200).json({ status: 'Success', data: { user: updatedUser } });
});

export { updateUser };
