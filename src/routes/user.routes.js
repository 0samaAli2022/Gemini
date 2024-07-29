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
  checkFollow,
} from '../controllers/user/user.index.js';
import { updateUserValidator } from '../utils/validation/user.validator.js';
import { uploadSinglePhoto } from '../config/Multer/multer.js';

const router = express.Router();

router.route('/').get(authMiddleware, getAllUsers);
router.route('/search').get(authMiddleware, searchUser);

router
  .route('/:id')
  .get(authMiddleware, getUser)
  .delete(authMiddleware, checkUserAuthorization, deleteUser)
  .patch(
    authMiddleware,
    checkUserAuthorization,
    uploadSinglePhoto,
    updateUserValidator,
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
router.route('/:id/isFollowing').get(authMiddleware, checkFollow);
// get user notification
router.route('/:id/notifications').get(authMiddleware, getUserNotifications);
export default router;
