const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users.js');

usersRouter.get('/', getUsers); // Получить всех пользователей

usersRouter.get('/:id', getUserById); // Получить пользователя по ID

usersRouter.post('/signup', createUser); // Создать пользователя

usersRouter.post('/signin', login); // Аутентифицировать пользователя

usersRouter.patch('/me', updateUser); // Обновить данные пользователя

usersRouter.patch('/me/avatar', updateAvatar); // Обновить аватар пользователя

module.exports = usersRouter;
