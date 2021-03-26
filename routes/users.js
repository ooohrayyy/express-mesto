const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users.js');

usersRouter.get('/', getUsers); // Получить всех пользователей

usersRouter.get('/:id', getUserById); // Получить пользователя по ID

usersRouter.post('/', createUser); // Создать пользователя

usersRouter.patch('/me', updateUser); // Обновить данные пользователя

usersRouter.patch('/me/avatar', updateAvatar); // Обновить аватар пользователя

module.exports = usersRouter;
