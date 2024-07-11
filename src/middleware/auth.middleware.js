import { PrismaClient } from '@prisma/client';
import asyncHandler from 'express-async-handler';
import APIError from '../utils/APIError.js';
import { verifyAccessToken } from '../utils/createToken.js';
import { redisClient } from '../config/Redis/redisClient.js';
const prisma = new PrismaClient();

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return next(new APIError('Authorization header not found', 400));
  const encodedToken = token.split(' ')[1];
  if (!encodedToken) return next(new APIError('Access token is not found', 403));
  const tokenExists = await redisClient.exists(encodedToken);
  if (!tokenExists) {
    return next(new APIError('Access token is not valid', 403));
  }
  const decodedToken = await verifyAccessToken(encodedToken);
  const user = await prisma.user.findUnique({
    where: { id: decodedToken.id },
    include: { profile: true },
  });
  if (!user) return next(new APIError('You are not allowed.', 401));
  req.user = user;
  req.token = encodedToken;
  next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) return next();
  const role = user.role;
  if (role !== 'ADMIN')
    return next(
      new APIError('You are not authorized to access this route.', 403)
    );
  next();
});

export { authMiddleware, isAdmin };
