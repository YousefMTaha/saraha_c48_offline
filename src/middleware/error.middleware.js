function globalErrMiddleware(err, req, res, next) {
  console.log({ err });

  res
    .status(err.cause?.statusCode || 400)
    .json({ errMsg: err.message, stack: err.stack, err, extra: err.cause });
}

export default globalErrMiddleware;
