import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import APIError from '../../utils/APIError.js';
import { createAccessToken } from '../../utils/createToken.js';
import { redisClient } from '../../config/Redis/redisClient.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const refresh = asyncHandler(async (req, res, next) => {
  const refreshToken = req?.cookies?.refreshToken;
  if (!refreshToken) return next(new APIError('You are not logged-In', 403));

  const decoded = await jwt.verify(refreshToken, process.env.JWT_REF_TOKEN);
  if (!decoded) return next(new APIError('Invalid session', 403));

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });
  if (!user) return next(new APIError('Invalid session', 403));

  const userId = await redisClient.get(refreshToken);
  if (!userId) return next(new APIError('Invalid session', 403));
  if (userId !== user.id) return next(new APIError('Invalid session', 403));

  const token = createAccessToken(user.id);
  redisClient.set(token, user.id, { EX: 15 * 60 });
  res.status(200).json({ token });
});

export { refresh };
