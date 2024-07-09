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

export { uploadImage };
