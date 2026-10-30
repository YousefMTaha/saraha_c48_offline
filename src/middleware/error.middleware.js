import { NODE_ENV } from "../config/config.js";

function globalErrMiddleware(err, req, res, next) {
  console.log({ err });

  NODE_ENV == "PROD"
    ? res.status(err.cause?.statusCode || 400).json({ errMsg: err.message })
    : res
        .status(err.cause?.statusCode || 400)
        .json({ errMsg: err.message, stack: err.stack, err, extra: err.cause });
}

export default globalErrMiddleware;
