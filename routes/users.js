const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users.js');

usersRouter.get('/', getUsers); // Получить всех пользователей

usersRouter.get('/me', getCurrentUser); // Получить данные текущего пользователя

usersRouter.patch( // Обновить данные пользователя
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser,
);

usersRouter.patch( // Обновить аватар пользователя
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/, 'URL')
        .min(2)
        .max(30)
        .required(),
    }),
  }),
  updateAvatar,
);

usersRouter.get( // Получить пользователя по ID
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById,
);

module.exports = usersRouter;
