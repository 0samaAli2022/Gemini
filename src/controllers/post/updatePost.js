import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import APIError from '../../utils/APIError.js';
import cloudinary from 'cloudinary';
import { imageConfig } from '../../config/Multer/multer.js';
import { uploadImage } from '../../config/Cloudinary/cloudinary.js';

const prisma = new PrismaClient();

const updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, privacy } = req.body;
  const post = await prisma.post.findUnique({ where: { id } });
  const images = []
  if (post.user_id !== req.user.id && req.user.role !== 'ADMIN')
    return next(new APIError('Unauthorized', 401));
  if (!post) return next(new APIError('Post not found', 404));
  if (req.files) {
    for (let i = 0; i < post.images.length; i++) {
      await cloudinary.v2.uploader.destroy(post.images[i]);
    }
    for(let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      file.buffer = await imageConfig(file.buffer);
      file.filename = `${post.id}-${Date.now()}-${i + 1}`;
      const result = await uploadImage(file.buffer, file.filename, 'posts');
      images.push(result.public_id);
    }
  }
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      title: title || post.title,
      content: content || post.content,
      privacy: privacy || post.privacy,
      images: images.length > 0 ? images : post.images,
    },
  });
  updatedPost.images = updatedPost.images.map(
    (image) => process.env.CLOUD_IMG_URL + image
  );
  res.status(200).json({ status: 'success', data: { post: updatedPost } });
});

export { updatePost };
