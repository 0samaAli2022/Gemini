import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
const prisma = new PrismaClient();

const getComments = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
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
  res.status(200).json({ status: 'success', data: { comments } });
});

export { getComments };
