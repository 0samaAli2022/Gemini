import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const searchUser = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  let page = +req.query.page || 1;
  page = page < 1 ? 1 : page;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const take = limit < 1 ? 10 : limit;
  const sort = req.query.sort || 'updatedAt';
  const order = req.query.order || 'desc';
  const orderBy = { [sort]: order };
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ],
    },
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

export { searchUser };
