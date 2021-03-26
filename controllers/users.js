const User = require('../models/user.js');

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

function createUser(req, res) { // Создать пользователя
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
