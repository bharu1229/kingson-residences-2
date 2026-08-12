// Global error handler middleware
exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large. Maximum size is 5MB.'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message
    });
  }

  // Firebase errors
  if (err.code === 'auth/email-already-exists') {
    return res.status(400).json({
      error: 'Email already exists'
    });
  }

  if (err.code === 'auth/user-not-found') {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  // Default error
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
};