const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users.js');

const { preValidateId, preValidateUserData, preValidateAvatar } = require('../middlewares/preValidate.js');

usersRouter.get('/', getUsers); // Получить всех пользователей

usersRouter.get('/me', getCurrentUser); // Получить данные текущего пользователя

usersRouter.patch( // Обновить данные пользователя
  '/me',
  preValidateUserData,
  updateUser,
);

usersRouter.patch( // Обновить аватар пользователя
  '/me/avatar',
  preValidateAvatar,
  updateAvatar,
);

usersRouter.get( // Получить пользователя по ID
  '/:id',
  preValidateId,
  getUserById,
);

module.exports = usersRouter;
