import APIError from '../../utils/APIError.js';
import sharp from 'sharp';
import multer from 'multer';
import asyncHandler from 'express-async-handler';
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

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter,
});

const uploadSinglePhoto = upload.single('image');
const uploadMultiPhotos = upload.array('images', 5);
const imageConfig = asyncHandler(async (imageBuffer) => {
  return await sharp(imageBuffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();
});

export { uploadMultiPhotos, uploadSinglePhoto, imageConfig };
