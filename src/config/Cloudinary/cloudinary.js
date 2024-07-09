import cloudinary from 'cloudinary';
import asyncHandler from 'express-async-handler';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadImage = asyncHandler(async (imageBuffer, filename, foldername) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    folder: foldername,
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    public_id: filename,
  };
  // Upload the image
  const uploadResult = await new Promise((resolve) => {
    cloudinary.v2.uploader
      .upload_stream(options, (error, uploadResult) => {
        return resolve(uploadResult);
      })
      .end(imageBuffer);
  });
  return uploadResult;
});

const uploadPhotosCloudinary = asyncHandler(async (req, res, next) => {
  if (!req.files && !req.file) return next();
  if (req.file) {
    if (req.user.profile.photo !== 'users/default_user') {
      await cloudinary.v2.uploader.destroy(req.user.profile.photo);
    }
    const result = await uploadImage(
      req.file.buffer,
      req.file.filename,
      'users'
    );
    console.log(result);
    req.file.filename = result.public_id;
  } else if (req.files) {
    req.images = [];
    for (let i = 0; i < req.files.length; i++) {
      const result = await uploadImage(
        req.files[i].buffer,
        req.files[i].filename,
        'posts'
      );
      req.images = [...req.images, result.public_id];
    }
  }
  next();
});

export { uploadPhotosCloudinary, uploadImage };
