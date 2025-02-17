import { PrismaClient } from '@prisma/client';
import { comparePassword } from '../../utils/hashingPassword.js';
import {
  createAccessToken,
  createRefreshToken,
} from '../../utils/createToken.js';
import APIError from '../../utils/APIError.js';
import asyncHandler from 'express-async-handler';
import { redisClient } from '../../config/Redis/redisClient.js';

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
      password: true,
      emailVerified: true,
      profile: {
        select: {
          bio: true,
          photo: true,
        },
      },
    },
  });
  if (!user) {
    return res.status(400).json({
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
    EX: 30 * 24 * 60 * 60, // Set the expiration time to 90 days
  });
  await redisClient.set(accessToken, user.id, {
    EX: 15 * 60, // Set the expiration time to 1 min
  });
  const cookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'prod') cookieOptions.secure = true;
  res.cookie('refreshToken', refreshToken, cookieOptions);
  // Remove password and tokens from output
  user.profile.photo = process.env.CLOUD_IMG_URL + user.profile.photo;
  user.password = undefined;
  res
    .status(200)
    .json({ status: 'success', data: { user, token: accessToken } });
});

export { login };
