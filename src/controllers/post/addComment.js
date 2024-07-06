import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import uuid4 from 'uuid4';
import APIError from '../../utils/APIError.js';
const prisma = new PrismaClient();

const addComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;
  // Check if the post exists
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  if (!post) {
    return next(new APIError('Post not found', 404));
  }
  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        id: uuid4(),
        content,
        post: {
          connect: {
            id,
          },
        },
        author: {
          connect: {
            id: req.user.id,
          },
        },
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
    }),
    prisma.post.update({
      where: {
        id,
      },
      data: {
        commentsCount: {
          increment: 1,
        },
      },
    }),
  ]);
  res.status(200).json({ status: 'success', data: { comment } });
});

export { addComment };
