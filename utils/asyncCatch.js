const asyncFunction = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err, req, res, next);
    }
  };
};

module.exports = asyncFunction;
