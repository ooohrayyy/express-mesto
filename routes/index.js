const router = require('express').Router();

const auth = require('../middlewares/auth.js');
const usersRouter = require('./users.js');
const {
  createUser,
  login,
} = require('../controllers/users.js');
const cardsRouter = require('./cards.js');

router.use('/signup', createUser);
router.use('/signin', login);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
