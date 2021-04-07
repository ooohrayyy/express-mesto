const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res) { // Получить всех пользователей
  User.find({})
    .orFail(new Error('В базе данных нет пользователей'))
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.message === 'В базе данных нет пользователей') {
        res.status(200).send({ message: err.message });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function getUserById(req, res) { // Получить пользователя по ID
  User.findById(req.params.id)
    .orFail(new Error('Нет пользователя с таким ID'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Нет пользователя с таким ID') {
        res.status(404).send({ message: 'Нет пользователя с таким ID' });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function getCurrentUser(req, res) {
  User.findById(req.user._id)
    .orFail(new Error('Нет пользователя с таким ID'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Нет пользователя с таким ID') {
        res.status(404).send({ message: 'Нет пользователя с таким ID' });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function createUser(req, res) { // Создать пользователя
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
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Введены некорректные данные' });
            return;
          }

          res.status(500).send({ message: 'На сервере произошла ошибка' });
        });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при хешировании пароля' }));
}

function updateUser(req, res) { // Обновить данные пользователя
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .orFail(new Error('Нет пользователя с таким ID'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
        return;
      }

      if (err.message === 'Нет пользователя с таким ID') {
        res.status(404).send({ message: err.message });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function updateAvatar(req, res) { // Обновить аватар пользователя
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .orFail(new Error('Нет пользователя с таким ID'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
        return;
      }

      if (err.message === 'Нет пользователя с таким ID') {
        res.status(404).send({ message: err.message });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function login(req, res) { // Залогинить пользователя
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          const token = jwt.send(
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
        })
        .catch((err) => {
          if (err.message === 'Неправильные почта или пароль') {
            res.status(401).send({ message: err.message });
            return;
          }

          res.status(500).send({ message: 'На сервере произошла ошибка' });
        });
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
