const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

function auth(req, res, next) {
  try {
    const payload = jwt.verify(req.cookies.jwt, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).send({ message: 'Неправильный токен авторизации' });
  }
}

module.exports = auth;
