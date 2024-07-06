import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
import cloudinary from 'cloudinary';

const prisma = new PrismaClient();

const updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, privacy } = req.body;
  const post = await prisma.post.findUnique({ where: { id } });
  if (post.user_id !== req.user.id && req.user.role !== 'ADMIN')
    return next(new APIError('Unauthorized', 401));
  if (req.images) {
    for (let i = 0; i < post.images.length; i++) {
      await cloudinary.v2.uploader.destroy(post.images[i]);
    }
  }
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      title: title || post.title,
      content: content || post.content,
      privacy: privacy || post.privacy,
      images: req.images || post.images,
    },
  });
  updatedPost.images = updatedPost.images.map((image) =>
    cloudinary.v2.url(image)
  );
  res.status(200).json({ status: 'success', data: { post: updatedPost } });
});

export { updatePost };
