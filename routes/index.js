const router = require('express').Router();

const auth = require('../middlewares/auth.js');
const usersRouter = require('./users.js');
const {
  createUser,
  login,
} = require('../controllers/users.js');
const cardsRouter = require('./cards.js');

router.post('/signup', createUser);
router.post('/signin', login);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
