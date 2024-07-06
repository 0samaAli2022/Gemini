import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET ALL POSTS OR POSTS BY USER
const getAllPosts = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (userId !== undefined) {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          id: userId,
        },
      },
    });
    res.status(200).json({ status: 'success', data: { posts } });
  } else {
    const posts = await prisma.post.findMany();
    res.status(200).json({ status: 'success', data: { posts } });
  }
});

const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  res.status(200).json({ status: 'success', data: { post } });
});

export { getAllPosts, getPost };
