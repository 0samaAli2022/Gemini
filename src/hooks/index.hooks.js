import authRouter from '../routes/auth.routes.js';
import userRouter from '../routes/user.routes.js';
import postRouter from '../routes/post.routes.js';
import { errorHandler, notFound } from '../middleware/errorHandler.js';

export default (app) => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/posts', postRouter);
  app.use('*', notFound);
  app.use(errorHandler);
};
