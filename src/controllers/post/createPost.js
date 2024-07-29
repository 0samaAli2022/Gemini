import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
import uuid4 from 'uuid4';
import APIError from '../../utils/APIError.js';
import { uploadImage } from '../../config/Cloudinary/cloudinary.js';
import { imageConfig } from '../../config/Multer/multer.js';
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
  if (req.files) {
    const images = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      file.buffer = await imageConfig(file.buffer);
      file.filename = `${postData.id}-${Date.now()}-${i + 1}`;
      const result = await uploadImage(file.buffer, file.filename, 'posts');
      images.push(result.public_id);
    }
    postData.images = images;
  }
  const post = await prisma.post.create({
    data: postData,
    include: {
      author: {
        select: { id: true, name: true, profile: { select: { photo: true } } },
      },
    },
  });
  post.images = post.images.map((image) => {
    return process.env.CLOUD_IMG_URL + image;
  });
  post.author.profile.photo =
    process.env.CLOUD_IMG_URL + post.author.profile.photo;  
  res.status(200).json({ status: 'success', data: { post } });
});

export { createPost };
