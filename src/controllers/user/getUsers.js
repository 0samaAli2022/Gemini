import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const getAllUsers = asyncHandler(async (req, res, next) => {
  let page = +req.query.page || 1;
  page = page < 1 ? 1 : page;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const take = limit < 1 ? 10 : limit;
  const sort = req.query.sort || 'updatedAt';
  const order = req.query.order || 'desc';
  const orderBy = { [sort]: order };
  const users = await prisma.user.findMany({
    skip,
    take,
    orderBy,
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
  users.forEach((user) => {
    console.log(user);
    user.profile.photo = process.env.CLOUD_IMG_URL + user.profile.photo;
    // Remove password and tokens from output
  });
  res.status(200).json({
    status: 'Success',
    data: { users },
    meta: {
      count: users.length,
      pagesCount: Math.ceil(users.length / take),
      currentPage: page,
      perPage: take,
    },
  });
});

const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
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
  user.profile.photo = process.env.CLOUD_IMG_URL + user.profile.photo;
  // Remove password and tokens from output
  res.status(200).json({ status: 'Success', data: { user } });
});

export { getAllUsers, getUser };
