const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  revokeLike,
} = require('../controllers/cards.js');

cardsRouter.get('/', getCards); // Получить все карточки

cardsRouter.post('/', createCard); // Создать карточку

cardsRouter.delete('/:id', deleteCard); // Удалить карточку по ID

cardsRouter.put('/:cardId/likes', putLike); // Поставить лайк карточке

cardsRouter.delete('/:cardId/likes', revokeLike); // Снять лайк с карточки

module.exports = cardsRouter;
