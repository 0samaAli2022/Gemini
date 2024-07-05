import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';

const prisma = new PrismaClient();

const updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, privacy } = req.body;
  const post = await prisma.post.findUnique({ where: { id } });
  if (post.user_id !== req.user.id && req.user.role !== 'ADMIN')
    return next(new APIError('Unauthorized', 401));
  const updatedPost = await prisma.post.update({
    where: { id },  
    data: {
      title: title || post.title,
      content: content || post.content,
      privacy: privacy || post.privacy,
      images: req.images || post.images,
    },
  });
  res.status(200).json({ status: 'success', data: { post: updatedPost } });
});

export { updatePost };
