import APIError from '../../utils/APIError.js';
import sharp from 'sharp';
import multer from 'multer';
import asyncHandler from 'express-async-handler';
import uuid4 from 'uuid4';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  )
    cb(null, true);
  else cb(new APIError('Unsupported file format', 400), false);
};

const imageConfig = asyncHandler(async (imageBuffer) => {
  return await sharp(imageBuffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();
});

const resizePhotos = (type) =>
  asyncHandler(async (req, res, next) => {
    if (!req.file && !req.files) return next();
    // Determine the prefix based on the type of photo (user or post)
    if (!['user', 'post'].includes(type))
      return next(new Error('Invalid photo type specified'));
    const prefix =
      type === 'user' ? `user-${req.user.id}` : `post-${req.params.id}`;
    // Process each file in req.files or req.file
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const filename = `${prefix}-${Date.now()}-${i + 1}`;
        req.files[i].filename = filename;
        req.files[i].buffer = await imageConfig(req.files[i].buffer); // Resize image
      }
    } else if (req.file) {
      const filename = `${prefix}-${Date.now()}`;
      req.file.filename = filename;
      req.file.buffer = await imageConfig(req.file.buffer); // Resize image
    }
    next();
  });

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter,
});

const uploadSinglePhoto = upload.single('image');
const uploadMultiPhotos = upload.array('images', 5);

export { uploadMultiPhotos, uploadSinglePhoto, resizePhotos };
