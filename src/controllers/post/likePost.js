import asyncHandler from 'express-async-handler';
import APIError from '../../utils/APIError.js';
import { PrismaClient } from '@prisma/client';
import uuid4 from 'uuid4';
const prisma = new PrismaClient();

const likePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      likes: true,
    },
  });
  if (!post) {
    return next(new APIError('Post not found', 404));
  }
  console.log(post.likes);
  if (
    post.likes.some(
      (like) => like.user_id === req.user.id && like.post_id === id
    )
  ) {
    return next(new APIError('You already liked this post', 400));
  }
  await prisma.like.create({
    data: {
      id: uuid4(),
      user: { connect: { id: req.user.id } },
      post: { connect: { id } },
    },
  });
  const updatedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      likesCount: {
        increment: 1,
      },
    },
  });
  res.status(200).json({ status: 'success', data: { post: updatedPost } });
});

const dislikePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      likes: true,
    },
  });
  if (!post) {
    return next(new APIError('Post not found', 404));
  }
  if (
    !post.likes.some(
      (like) => like.user_id === req.user.id && like.post_id === id
    )
  ) {
    return next(new APIError('You have not liked this post', 400));
  }
  await prisma.like.deleteMany({
    where: {
      post: { id },
      user: { id: req.user.id },
    },
  });
  const updatedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      likesCount: {
        decrement: 1,
      },
    },
    include: {
      likes: true,
    },
  });
  res.status(200).json({ status: 'success', data: { post: updatedPost } });
});

export { likePost, dislikePost };
