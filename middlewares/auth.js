const jwt = require('jsonwebtoken');

const AuthenticationError = require('../errors/authentication-err.js');

const { JWT_SECRET = 'c84ed5cf11256215ed6f6a06392aef23ad7478a2e056f06ec0f6e5ac58b4482d' } = process.env;

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
