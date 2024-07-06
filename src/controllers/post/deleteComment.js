import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
const prisma = new PrismaClient();

const deleteComment = asyncHandler(async (req, res, next) => {
  const { id, commentId } = req.params;
  // Check if the post exists
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  if (!post) {
    return next(new APIError('Post not found', 404));
  }
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!comment) {
    return next(new APIError('Comment not found', 404));
  }
  if (comment.user_id !== req.user.id && req.user.role !== 'ADMIN') {
    return next(new APIError('Unauthorized', 401));
  }
  const [deletedComment] = await prisma.$transaction([
    prisma.comment.delete({
      where: {
        id: commentId,
      },
    }),
    prisma.post.update({
      where: {
        id,
      },
      data: {
        commentsCount: {
          decrement: 1,
        },
      },
    }),
  ]);
  res
    .status(200)
    .json({ status: 'success', data: { comment: deletedComment } });
});
export { deleteComment };
