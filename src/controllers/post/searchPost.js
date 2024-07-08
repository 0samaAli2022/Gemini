import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const searchPost = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  let page = +req.query.page || 1;
  page = page < 1 ? 1 : page;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  const take = limit < 1 ? 10 : limit;
  const sort = req.query.sort || 'updatedAt';
  const order = req.query.order || 'desc';
  const orderBy = { [sort]: order };
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      author: {
        select: {
          name: true,
          profile: {
            select: {
              photo: true,
            },
          },
        },
      },
      comments: {
        select: {
          content: true,
          author: {
            select: {
              id: true,
              name: true,
              profile: { select: { photo: true } },
            },
          },
        },
      },
    },
    skip,
    take,
    orderBy,
  });
  res.status(200).json({
    status: 'success',
    data: { count: posts.length, posts },
    meta: {
      count: posts.length,
      pagesCount: Math.ceil(posts.length / take),
      currentPage: page,
      perPage: take,
    },
  });
});
export { searchPost };
