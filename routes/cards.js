const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  revokeLike,
} = require('../controllers/cards.js');

cardsRouter.get('/', getCards);

cardsRouter.post('/', createCard);

cardsRouter.delete('/:id', deleteCard);

cardsRouter.put('/:cardId/likes', putLike);

cardsRouter.delete('/:cardId/likes', revokeLike);

module.exports = cardsRouter;
