function notFoundMiddleware(req, res) {
  res
    .status(404)
    .json({ msg: `INVALID URL ${req.url} OR METHOD ${req.method}` });
}

export default notFoundMiddleware