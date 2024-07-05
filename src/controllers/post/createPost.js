import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import uuid4 from 'uuid4';
const prisma = new PrismaClient();

const createPost = asyncHandler(async (req, res) => {
  const { title, content, privacy } = req.body;
  // Prepare the data object with default values from schema
  const postData = {
    id: uuid4(),
    title,
    content,
    author: { connect: { id: req.user.id } },
  };
  // Check if privacy is defined, and set it if so
  if (privacy !== undefined) {
    postData.privacy = privacy;
  }
  const post = await prisma.post.create({
    data: postData,
    include: { author: { select: { name: true } } },
  });
  res.status(200).json({ status: 'success', data: { post } });
});

export { createPost };
