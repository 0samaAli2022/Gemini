import APIError from '../utils/APIError.js';

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      status: err.statusText,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.statusText,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.statusText = err.statusText || 'Internal Server Error';

  if (process.env.NODE_ENV === 'dev') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'prod') {
    sendErrorProd(err, res);
  }
};

const notFound = (req, res, next) => {
  next(new APIError(`Route not found: ${req.originalUrl}`, 404));
};

export { errorHandler, notFound };
