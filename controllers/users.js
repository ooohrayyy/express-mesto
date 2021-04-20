const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const { NODE_ENV, JWT_SECRET } = process.env;

const AuthenticationError = require('../errors/authentication-err.js');
const EmptyDatabaseError = require('../errors/empty-database-err.js');
const IncorrectValueError = require('../errors/incorrect-value-err.js');
const ExistingEmailError = require('../errors/existing-email-err.js');
const NotFoundError = require('../errors/not-found-err.js');

function getUsers(req, res, next) { // Получить всех пользователей
  User.find({})
    .orFail(new EmptyDatabaseError('В базе данных нет пользователей'))
    .then((users) => res.send(users))
    .catch((err) => next(err));
}

function getUserById(req, res, next) { // Получить пользователя по ID
  User.findById(req.params.id)
    .orFail(new NotFoundError('Нет пользователя с таким ID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет пользователя с таким ID'));
      }

      next(err);
    });
}

function getCurrentUser(req, res, next) { // Получить данные о себе
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким ID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет пользователя с таким ID'));
      }

      next(err);
    });
}

function createUser(req, res, next) { // Создать пользователя
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new IncorrectValueError('Введены некорректные данные'));
          } else if (err.code === 11000) {
            next(new ExistingEmailError('Уже есть пользователь с такой почтой'));
          }

          next(err);
        });
    })
    .catch((err) => {
      if (err.message.includes('Illegal arguments')) {
        next(new IncorrectValueError('Не введён пароль'));
      }

      next(err);
    });
}

function updateUser(req, res, next) { // Обновить данные пользователя
  const { name, about } = req.body;
  const id = req.user._id;

  if (!name || !about) {
    throw new IncorrectValueError('Не введены имя или описание');
  }

  User.findByIdAndUpdate(id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .orFail(new NotFoundError('Нет пользователя с таким ID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectValueError('Введены некорректные данные'));
      }

      next(err);
    });
}

function updateAvatar(req, res, next) { // Обновить аватар пользователя
  const { avatar } = req.body;
  const id = req.user._id;

  if (!avatar) {
    throw new IncorrectValueError('Введены некорректные данные');
  }

  User.findByIdAndUpdate(id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .orFail(new NotFoundError('Нет пользователя с таким ID'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectValueError('Введены некорректные данные'));
      }

      next(err);
    });
}

function login(req, res, next) { // Залогинить пользователя
  const { email, password } = req.body;

  if (!email || !password) {
    throw new IncorrectValueError('Не введены почта или пароль');
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthenticationError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthenticationError('Неправильные почта или пароль');
          }

          const token = jwt.sign(
            { _id: user.id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );

          return res.cookie(
            'jwt',
            token,
            {
              maxAge: 3600000,
              httpOnly: true,
              sameSite: true,
            },
          ).send({ message: 'Аутентификация прошла успешно!' });
        });
    })
    .catch((err) => {
      if (err.message.includes('Illegal arguments')) {
        next(new IncorrectValueError('Введены некорректные данные'));
      }

      next(err);
    });
}

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
