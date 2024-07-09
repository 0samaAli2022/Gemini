import { PrismaClient } from '@prisma/client';
import { comparePassword } from '../../utils/hashingPassword.js';
import {
  createAccessToken,
  createRefreshToken,
} from '../../utils/createToken.js';
import APIError from '../../utils/APIError.js';
import asyncHandler from 'express-async-handler';
import { redisClient } from '../../config/Redis/redisClient.js';
import cloudinary from 'cloudinary';

const prisma = new PrismaClient();

/**
 * @desc    Users use email and password to login
 * @method  post
 * @route   /api/v1/auth/login
 * @access  public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
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
  if (!user) {
    return res.status(401).json({
      message: 'Wrong email or password',
    });
  }
  const matchedPasswords = await comparePassword(password, user.password);
  if (!matchedPasswords)
    return next(new APIError('Wrong email or password.', 400));

  if (!user.emailVerified) {
    return next(
      new APIError(
        "You haven't verified your account yet. Please follow the link sent to your email to verify.",
        403
      )
    );
  }
  const accessToken = await createAccessToken(user.id);
  const refreshToken = await createRefreshToken(user.id);

  await redisClient.set(refreshToken, user.id, {
    EX: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60, // Set the expiration time to 90 days
  });
  const cookieOptions = {
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'prod') cookieOptions.secure = true;
  res.cookie('refreshToken', refreshToken, cookieOptions);
  // Remove password and tokens from output
  user.profile.photo = cloudinary.v2.url(user.profile.photo);
  res
    .status(200)
    .json({ status: 'success', data: { user, token: accessToken } });
});

export { login };
