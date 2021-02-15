const catchAsync = (fn) => (req, res, next): void => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
}

export default catchAsync
