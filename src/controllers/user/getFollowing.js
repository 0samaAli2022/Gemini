import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
const prisma = new PrismaClient();

const getFollowing = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let page = +req.query.page || 1;
  page = page < 1 ? 1 : page;
  let take = +req.query.limit || 10;
  take = take < 1 ? 10 : take;
  const skip = (page - 1) * take;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      following: {
        skip,
        take,
        select: {
          followed: {
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
  user.following = user.following.map((f) => f.followed);
  const pagesCount = Math.ceil(
    (await prisma.followRelation.count({ where: { follower_id: id } })) / take
  );
  res.status(200).json({
    status: 'Success',
    data: {
      following: user.following,
    },
    meta: {
      count: user.following.length,
      pagesCount,
      currentPage: page,
      perPage: take,
    },
  });
});

export { getFollowing };
