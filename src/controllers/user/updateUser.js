import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import cloudinary from 'cloudinary';

const prisma = new PrismaClient();

const updateUser = asyncHandler(async (req, res, next) => {
  const { name, role, isActive } = req.body;
  const dataToUpdate = {};
  if (req.file) {
    dataToUpdate.photo = req.file.filename;
  }
  if (name !== undefined) {
    dataToUpdate.name = name;
  }
  if (role !== undefined) {
    dataToUpdate.role = role;
  }
  if (isActive !== undefined) {
    dataToUpdate.isActive = isActive;
  }

  const user = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: dataToUpdate,
  });
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
  user.photo = cloudinary.v2.url(req.file.filename);
  console.log(user.photo);
  res.status(200).json({ status: 'Success', data: user });
});

export { updateUser };
