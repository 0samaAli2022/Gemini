import APIError from '../../utils/APIError.js';
import sharp from 'sharp';
import multer from 'multer';

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

const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}`;
  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpg')
    .jpeg({ quality: 90 })
    .toBuffer();
  next();
};

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter,
});

const uploadSinglePhoto = upload.single('image');
const uploadMultiPhotos = upload.array('images', 5);

export { uploadMultiPhotos, uploadSinglePhoto, resizeUserPhoto };
