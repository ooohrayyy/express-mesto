const usersRouter = require('express').Router();

const { getUsers, getUserById, createUser } = require('../controllers/users.js');

usersRouter.get('/', getUsers);

usersRouter.get('/:id', getUserById);

usersRouter.post('/', createUser);

module.exports = usersRouter;
