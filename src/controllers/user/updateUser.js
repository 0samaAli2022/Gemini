import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';
import { imageConfig } from '../../config/Multer/multer.js';
import { uploadImage } from '../../config/Cloudinary/cloudinary.js';
const prisma = new PrismaClient();

const updateUser = asyncHandler(async (req, res, next) => {
  const { name, role, bio } = req.body;
  const user = req.user;
  const dataToUpdate = {
    name: name || user.name,
    role: role || user.role,
    profile: {
      update: {
        bio: bio || user.profile.bio,
      },
    },
  };
  if (req.file) {
    const file = req.file;
    if (req.user.profile.photo !== 'users/default_user') {
      await cloudinary.v2.uploader.destroy(user.profile.photo);
    }
    file.buffer = await imageConfig(file.buffer);
    file.filename = `${user.id}-${Date.now()}`;
    const result = await uploadImage(file.buffer, file.filename, 'users');
    dataToUpdate.profile.update.photo = result.public_id;
  }

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
          bio: true,
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
