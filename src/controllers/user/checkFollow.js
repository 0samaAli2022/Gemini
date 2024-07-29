import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const checkFollow = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const following = await prisma.followRelation.findUnique({
    where: {
      follower_id_followed_id: {
        follower_id: req.user.id,
        followed_id: id,
      },
    },
  });
  const isFollowing = following ? true : false;
  res.status(200).json({
    status: 'success',
    data: {
      isFollowing,
    },
  });
});

export { checkFollow };
