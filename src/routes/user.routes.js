import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkUserAuthorization } from '../middleware/checkUserAuthorization.js';
import {
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/user/user.index.js';
import { updateUserValidator } from '../utils/validation/user.validator.js';
import { uploadSinglePhoto, resizeUserPhoto } from '../config/Multer/multer.js';
import { upload } from '../config/Cloudinary/cloudinary.js';

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
    upload,
    updateUser
  );

export default router;
