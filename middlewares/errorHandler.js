const errorHandler = (err, req, res, next) => {
  // Log with context
  console.error({
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    userId: req.user?.id,
  });

  // Validation errors (from express-validator)
  if (err.type === 'validation' || err.errors) {
    return res.status(400).json({ error: 'Validation failed', errors: err.errors });
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ error: `${field} already exists` });
  }

  // MongoDB cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Known HTTP errors
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode < 500 ? err.message : 'Internal Server Error';

  const response = { error: message };
  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
