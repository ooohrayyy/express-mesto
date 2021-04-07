const jwt = require('jsonwebtoken');

const AuthenticationError = require('../errors/authentication-err.js');

const { JWT_SECRET } = process.env;

function auth(req, res, next) {
  try {
    const payload = jwt.verify(req.cookies.jwt, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(new AuthenticationError('Неправильный токен авторизации'));
  }
}

module.exports = auth;
