import authRouter from '../routes/auth.routes.js';
import userRouter from '../routes/user.routes.js';
import { errorHandler, notFound } from '../middleware/errorHandler.js';

export default (app) => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('*', notFound);
  app.use(errorHandler);
};
