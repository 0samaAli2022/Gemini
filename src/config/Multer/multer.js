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

const resizeUserPhotos = asyncHandler(async (req, res, next) => {
  if (!req.files) return next();
  const uuid = uuid4();
  console.log(req.files);
  for (let i = 0; i < req.files.length; i++) {
    const filename = `post-${uuid}-${Date.now()}-${i + 1}`;
    req.files[i].filename = filename;
    req.files[i].buffer = await sharp(req.files[i].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();
  }
  next();
});

const resizeUserPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}`;
  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();
  next();
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter,
});

const uploadSinglePhoto = upload.single('image');
const uploadMultiPhotos = upload.array('images', 5);

export {
  uploadMultiPhotos,
  uploadSinglePhoto,
  resizeUserPhoto,
  resizeUserPhotos,
};
