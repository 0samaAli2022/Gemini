import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import APIError from '../../utils/APIError.js';
import { createAccessToken } from '../../utils/createToken.js';
import { redisClient } from '../../config/Redis/redisClient.js';
import { PrismaClient } from '@prisma/client';

const prisma = PrismaClient;

const refresh = asyncHandler(async (req, res, next) => {
  const refreshToken = req?.cookies?.refreshToken;
  if (!refreshToken) return next(new APIError('You are not logged-In', 403));

  const decoded = jwt.verify(refreshToken, process.env.JWT_REF_TOKEN);
  if (!decoded) return next(new APIError('Invalid session', 403));

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });
  if (!user) return next(new APIError('Invalid session', 403));

  redisClient.get(refreshToken, async (err, userId) => {
    if (err) return next(new APIError('Redis error', 500));
    if (!userId) return next(new APIError('Invalid session', 403));
    if (userId !== user.id) return next(new APIError('Invalid session', 403));
  });

  const accessToken = createAccessToken(user.id);
  res.status(200).json({ accessToken });
});

export { refresh };
