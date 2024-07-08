import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
import uuid4 from 'uuid4';
const prisma = new PrismaClient();

const followUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const followedUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!followedUser) {
    return next(new APIError('User not found', 404));
  }
  if (followedUser.id === req.user.id) {
    return next(new APIError('You cannot follow yourself', 400));
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      following: true,
    },
  });
  if (
    user.following.some(
      (following) => following.followed_id === followedUser.id
    )
  ) {
    return next(new APIError('You are already following this user', 400));
  }
  const followRelation = await prisma.followRelation.create({
    data: {
      id: uuid4(),
      follower_id: req.user.id,
      followed_id: followedUser.id,
    },
  });
  res.status(200).json({
    status: 'Success',
    data: {
      followRelation,
    },
  });
});

const unfollowUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const followedUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!followedUser) {
    return next(new APIError('User not found', 404));
  }
  if (followedUser.id === req.user.id) {
    return next(new APIError('You cannot unfollow yourself', 400));
  }
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      following: true,
    },
  });
  if (
    !user.following.some(
      (following) => following.followed_id === followedUser.id
    )
  ) {
    return next(new APIError('You are not following this user', 400));
  }
  const followRelation = await prisma.followRelation.delete({
    where: {
      follower_id_followed_id: {
        follower_id: req.user.id,
        followed_id: followedUser.id,
      },
    },
  });
  res.status(200).json({
    status: 'Success',
    data: {
      followRelation,
    },
  });
});

export { followUser, unfollowUser };
