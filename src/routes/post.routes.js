import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  // likePost,
  // dislikePost,
  // getPostsByUser,
} from '../controllers/post/post.index.js';
import { createPostValidator } from '../utils/validation/post.validator.js';
import { resizePhotos, uploadMultiPhotos } from '../config/Multer/multer.js';
import { uploadPhotosCloudinary } from '../config/Cloudinary/cloudinary.js';

const router = express.Router();

router
  .route('/')
  .get(authMiddleware, getAllPosts)
  .post(authMiddleware, createPostValidator, createPost);
router
  .route('/:id')
  .get(authMiddleware, getPost)
  .delete(authMiddleware, deletePost)
  .patch(
    authMiddleware,
    uploadMultiPhotos,
    resizePhotos('post'),
    uploadPhotosCloudinary,
    updatePost
  );

export default router;
