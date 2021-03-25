const usersRouter = require('express').Router();

const User = require('../models/user.js');

usersRouter.get('/', (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err }));
});

module.exports = usersRouter;
