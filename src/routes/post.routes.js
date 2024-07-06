import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';
import {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  addComment,
  getComments,
  deleteComment,
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

router.route('/:id/like').post(authMiddleware, likePost);
router.route('/:id/dislike').post(authMiddleware, dislikePost);

router
  .route('/:id/comments')
  .post(authMiddleware, addComment)
  .get(authMiddleware, getComments);

router.route('/:id/comments/:commentId').delete(authMiddleware, deleteComment);

export default router;
