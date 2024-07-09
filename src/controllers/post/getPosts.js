import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET ALL POSTS OR POSTS BY USER
const getAllPosts = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  let skip = (page - 1) * limit;
  skip = skip < 0 ? 0 : skip;
  const take = limit < 1 ? 10 : limit;
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
        privacy: 'PRIVATE',
        user_id: req.user.id,
      },
    ],
  };

  if (userId) {
    whereCondition = {
      AND: [{ author: { id: userId } }, whereCondition],
    };
  }
  if (userId !== undefined) {
    const posts = await prisma.post.findMany({
      skip,
      take,
      orderBy,
      where: whereCondition,
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
    res.status(200).json({
      status: 'success',
      data: { posts },
      meta: {
        count: posts.length,
        pagesCount: Math.ceil(posts.length / take),
        currentPage: page,
        perPage: take,
      },
    });
  } else {
    const posts = await prisma.post.findMany({
      skip,
      take,
      orderBy,
      where: whereCondition,
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
    res.status(200).json({
      status: 'success',
      data: { posts },
      meta: {
        count: posts.length,
        pagesCount: Math.ceil(posts.length / take),
        currentPage: page,
        perPage: take,
      },
    });
  }
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
