import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getUserNotifications = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const notifications = await prisma.notification.findMany({
    where: {
      user_id: id,
    },
  });
  res.status(200).json({ status: 'Success', data: { notifications } });
});

export { getUserNotifications };
