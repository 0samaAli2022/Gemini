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
  searchPost,
} from '../controllers/post/post.index.js';
import { createPostValidator } from '../utils/validation/post.validator.js';
import { uploadMultiPhotos } from '../config/Multer/multer.js';

const router = express.Router();

router
  .route('/')
  .get(authMiddleware, getAllPosts)
  .post(authMiddleware, uploadMultiPhotos, createPostValidator, createPost);
router.route('/search').get(searchPost);
router
  .route('/:id')
  .get(authMiddleware, getPost)
  .delete(authMiddleware, deletePost)
  .patch(authMiddleware, uploadMultiPhotos, updatePost);

router
  .route('/:id/like')
  .post(authMiddleware, likePost)
  .delete(authMiddleware, dislikePost);

router
  .route('/:id/comments')
  .post(authMiddleware, addComment)
  .get(authMiddleware, getComments);

router.route('/:id/comments/:commentId').delete(authMiddleware, deleteComment);

export default router;
