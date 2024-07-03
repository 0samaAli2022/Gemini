class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.statusText =
      statusCode == 400
        ? 'Bad Request'
        : statusCode == 401
        ? 'Unauthorized'
        : statusCode == 403
        ? 'Forbidden'
        : statusCode == 404
        ? 'Not found'
        : 'Internal Server Error.';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default APIError;
