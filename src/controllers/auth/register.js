import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../utils/hashingPassword.js';
import crypto from 'crypto';
import APIError from '../../utils/APIError.js';
import asyncHandler from 'express-async-handler';
import { sendEmailToUser } from '../../config/Nodemailer/nodemailer.js';
import uuid4 from 'uuid4';
import cloudinary from 'cloudinary';

const prisma = new PrismaClient();

/**
 * @desc    users create new acount
 * @method  post
 * @route   /api/v1/auth/redister
 * @access  public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return next(new APIError('Passwords do not match', 400));
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      id: uuid4(),
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          id: uuid4(),
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      profile: {
        select: {
          photo: true,
        },
      },
    },
  });
  if (!user)
    return next(
      new APIError(
        'Something wrong happened while signing-up, please try again later',
        400
      )
    );
  const plainVerfiyToken = crypto.randomBytes(64).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(plainVerfiyToken)
    .digest('hex');
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerificationToken: hashedToken,
    },
  });
  const info = {
    to: email,
    subject: 'Email verfication',
    text: 'Verifiy your email',
    htm: `<h1>Email verfication </h1>
                      <p>Hello ${user.name}, Please follow this link to verfiy your account. </p><a href= 'http://localhost:3000/api/v1/auth/verfiy/${plainVerfiyToken}'> Click link </a>
                      <p>If you did not verfiy your account you won't be able to use a lot of website features</p>`,
  };
  await sendEmailToUser(info);

  user.profile.photo = process.env.CLOUD_IMG_URL + user.profile.photo;
  // Remove password and tokens from output
  res.status(200).json({ status: 'Success', data: { user } });
});

export { register };
