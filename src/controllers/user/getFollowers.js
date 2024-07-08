import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
const prisma = new PrismaClient();

const getFollowers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let page = +req.query.page || 1;
  page = page < 1 ? 1 : page;
  let take = +req.query.limit || 10;
  take = take < 1 ? 10 : take;
  const skip = (page - 1) * take;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      followers: {
        skip,
        take,
        select: {
          follower: {
            select: {
              id: true,
              name: true,
              profile: {
                select: {
                  photo: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!user) {
    return next(new APIError('User not found', 404));
  }
  user.followers = user.followers.map((f) => f.follower);
  res.status(200).json({
    status: 'Success',
    data: {
      followers: user.followers,
    },
    meta: {
      count: user.followers.length,
      pagesCount: Math.ceil(user.followers / take),
      currentPage: page,
      perPage: take,
    },
  });
});

export { getFollowers };
