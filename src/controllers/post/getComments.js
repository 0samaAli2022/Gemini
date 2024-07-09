import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
const prisma = new PrismaClient();

const getComments = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  let skip = (page - 1) * limit;
  skip = skip < 0 ? 0 : skip;
  const take = limit < 1 ? 10 : limit;
  const sort = req.query.sort || 'updatedAt';
  const order = req.query.order || 'desc';
  const orderBy = { [sort]: order };
  // Check if the post exists
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  if (!post) {
    return next(new APIError('Post not found', 404));
  }
  const comments = await prisma.comment.findMany({
    skip,
    take,
    orderBy,
    where: {
      post_id: id,
    },
    select: {
      content: true,
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
    },
  });
  const pagesCount = Math.ceil(
    (await prisma.comment.count({ where: { post_id: id } })) / take
  );
  res.status(200).json({
    status: 'success',
    data: { comments },
    meta: {
      count: comments.length,
      pagesCount,
      currentPage: page,
      perPage: take,
    },
  });
});

export { getComments };
