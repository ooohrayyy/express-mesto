const cardsRouter = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards.js');

cardsRouter.get('/', getCards);

cardsRouter.post('/', createCard);

cardsRouter.delete('/:id', deleteCard);

module.exports = cardsRouter;
