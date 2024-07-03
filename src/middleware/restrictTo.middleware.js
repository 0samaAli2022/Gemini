import APIError from '../utils/APIError';

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new APIError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

export { restrictTo };
