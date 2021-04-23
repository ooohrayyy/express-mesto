const router = require('express').Router();

const auth = require('../middlewares/auth.js');
const { preValidateNewUser, preValidateLogin } = require('../middlewares/preValidate.js');

const usersRouter = require('./users.js');
const {
  createUser,
  login,
  signOut,
} = require('../controllers/users.js');
const cardsRouter = require('./cards.js');

const NotFoundError = require('../errors/not-found-err.js');

router.get('/crash-test', () => { // Краш-тест
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post( // Создать пользователя
  '/signup',
  preValidateNewUser,
  createUser,
);

router.post( // Залогинить пользователя
  '/signin',
  preValidateLogin,
  login,
);

router.delete('/signout', signOut);

router.use('/users', auth, usersRouter);

router.use('/cards', auth, cardsRouter);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
