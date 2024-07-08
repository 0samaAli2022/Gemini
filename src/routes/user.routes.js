import express from 'express';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';
import { checkUserAuthorization } from '../middleware/checkUserAuthorization.js';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUser,
  getUserNotifications,
} from '../controllers/user/user.index.js';
import { updateUserValidator } from '../utils/validation/user.validator.js';
import { uploadSinglePhoto, resizePhotos } from '../config/Multer/multer.js';
import { uploadPhotosCloudinary } from '../config/Cloudinary/cloudinary.js';

const router = express.Router();

router.route('/').get(authMiddleware, getAllUsers);
router.route('/search').get(authMiddleware, searchUser);

router
  .route('/:id')
  .get(authMiddleware, getUser)
  .delete(authMiddleware, isAdmin, deleteUser)
  .patch(
    authMiddleware,
    checkUserAuthorization,
    updateUserValidator,
    uploadSinglePhoto,
    resizePhotos('user'),
    uploadPhotosCloudinary,
    updateUser
  );

// follow and unfollow
router
  .route('/:id/follow')
  .post(authMiddleware, followUser)
  .delete(authMiddleware, unfollowUser);
// get followers and following
router.route('/:id/followers').get(authMiddleware, getFollowers);
router.route('/:id/following').get(authMiddleware, getFollowing);
// get user notification
router.route('/:id/notifications').get(authMiddleware, getUserNotifications);
export default router;
