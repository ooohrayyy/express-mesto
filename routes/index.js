const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth.js');

const usersRouter = require('./users.js');
const {
  createUser,
  login,
} = require('../controllers/users.js');
const cardsRouter = require('./cards.js');

const NotFoundError = require('../errors/not-found-err.js');

router.post( // Создать пользователя
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/, 'URL'),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  createUser,
);
router.post( // Залогинить пользователя
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  login,
);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
