/**
 * Wrapper to catch errors in async functions
 * Eliminates need for try-catch blocks
 */

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;