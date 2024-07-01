import authRouter from '../routes/auth.routes.js';
import { errorHandler, notFound } from '../middleware/errorHandler.js';

export default (app) => {
  app.use('/api/v1/auth', authRouter);
  app.use('*', notFound);
  app.use(errorHandler);
};
