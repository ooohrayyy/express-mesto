function error(err, req, res, next) {
  res.send({ message: err.message });
}
