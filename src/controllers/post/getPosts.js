import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET ALL POSTS OR POSTS BY USER
const getAllPosts = asyncHandler(async (req, res) => {
  const { userId, privacy } = req.query;
  let page = +req.query.page || 1;
  page = page < 1 ? 1 : page;
  let limit = +req.query.limit || 10;
  limit = limit < 1 ? 10 : limit;
  let skip = (page - 1) * limit;
  const take = limit;
  const sort = req.query.sort || 'updatedAt';
  const order = req.query.order || 'desc';
  const orderBy = { [sort]: order };
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { following: true },
  });
  const followedIds = user.following.map((user) => user.followed_id);
  let whereCondition = {
    OR: [
      {
        privacy: 'PUBLIC',
      },
      {
        privacy: 'FOLLOWERS',
        user_id: { in: followedIds },
      },
      {
        user_id: req.user.id,
      },
    ],
  };

  if (userId) {
    whereCondition = {
      AND: [{ author: { id: userId } }, whereCondition],
    };
  }
  if (privacy) {
    whereCondition = {
      AND: [{ privacy }, whereCondition],
    };
  }
  const posts = await prisma.post.findMany({
    skip,
    take,
    orderBy,
    where: whereCondition,
    include: {
      author: {
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
  });

  posts.forEach((post) => {
    post.images = post.images.map((image) => {
      return process.env.CLOUD_IMG_URL + image;
    });
    post.author.profile.photo =
      process.env.CLOUD_IMG_URL + post.author.profile.photo;
  });
  const pagesCount = Math.ceil(
    (await prisma.post.count({ where: whereCondition })) / take
  );
  res.status(200).json({
    status: 'success',
    data: { posts },
    meta: {
      count: posts.length,
      pagesCount,
      currentPage: page,
      perPage: take,
    },
  });
});

const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id,
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
  });
  res.status(200).json({ status: 'success', data: { post } });
});

export { getAllPosts, getPost };
