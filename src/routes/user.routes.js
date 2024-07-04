import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkUserAuthorization } from '../middleware/checkUserAuthorization.js';
import {
  getAllUsers,
  getUser,
  updateUser,
  test,
} from '../controllers/user/user.index.js';
import { updateUserValidator } from '../utils/validation/user.validator.js';
import {
  uploadSinglePhoto,
  uploadMultiPhotos,
  resizeUserPhoto,
  resizeUserPhotos,
} from '../config/Multer/multer.js';
import {
  uploadPhotoCloudinary,
  uploadPhotosCloudinary,
} from '../config/Cloudinary/cloudinary.js';

const router = express.Router();

router.route('/').get(authMiddleware, getAllUsers);
router
  .route('/:id')
  .get(authMiddleware, getUser)
  .patch(
    authMiddleware,
    checkUserAuthorization,
    updateUserValidator,
    uploadSinglePhoto,
    resizeUserPhoto,
    uploadPhotoCloudinary,
    updateUser
  );
router.post(
  '/upload',
  authMiddleware,
  uploadMultiPhotos,
  resizeUserPhotos,
  uploadPhotosCloudinary,
  test
);
export default router;
