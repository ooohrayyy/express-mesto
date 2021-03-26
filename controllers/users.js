const User = require('../models/user.js');

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.send({ message: 'В базе данных нет пользователей' });
        return;
      }

      res.send({ data: users });
    })
    .catch((err) => res.status(500).send({ message: err }));
}

function getUserById(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким ID' });
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
        return;
      }

      res.status(500).send({ message: err });
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
        return;
      }

      res.status(500).send({ message: err });
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким ID' });
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
        return;
      }

      res.status(500).send({ message: err });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким ID' });
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
        return;
      }

      res.status(500).send({ message: err });
    });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
