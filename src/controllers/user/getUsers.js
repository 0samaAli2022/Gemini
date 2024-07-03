import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ status: 'Success', data: users });
});

const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  res.status(200).json({ status: 'Success', data: user });
});

export { getAllUsers, getUser };
