// Central error handler - catches thrown/next(err) errors and Sequelize validation errors
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = {};
    err.errors.forEach((e) => {
      errors[e.path] = e.message;
    });
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  const status = err.statusCode || 500;
  return res.status(status).json({ message: err.message || 'Internal server error' });
}

module.exports = errorHandler;
