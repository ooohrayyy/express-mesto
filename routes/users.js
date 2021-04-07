const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users.js');

usersRouter.get('/', getUsers); // Получить всех пользователей

usersRouter.get('/me', getCurrentUser); // Получить данные текущего пользователя

usersRouter.patch('/me', updateUser); // Обновить данные пользователя

usersRouter.patch('/me/avatar', updateAvatar); // Обновить аватар пользователя

usersRouter.get('/:id', getUserById); // Получить пользователя по ID

module.exports = usersRouter;
