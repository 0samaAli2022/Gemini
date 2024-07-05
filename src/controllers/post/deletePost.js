import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (post.user_id !== req.user.id && req.user.role !== 'ADMIN')
    return next(new APIError('Unauthorized', 401));
  const deletedPost = await prisma.post.delete({
    where: { id },
  });
  res.status(200).json({ status: 'success', data: { post: deletedPost } });
});
export { deletePost };
