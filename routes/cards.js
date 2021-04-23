const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  revokeLike,
} = require('../controllers/cards.js');

const { preValidateId, preValidateCardData } = require('../middlewares/preValidate.js');

cardsRouter.get('/', getCards); // Получить все карточки

cardsRouter.post( // Создать карточку
  '/',
  preValidateCardData,
  createCard,
);

cardsRouter.delete( // Удалить карточку по ID
  '/:id',
  preValidateId,
  deleteCard,
);

cardsRouter.put( // Поставить лайк карточке
  '/:id/likes',
  preValidateId,
  putLike,
);

cardsRouter.delete( // Снять лайк с карточки
  '/:id/likes',
  preValidateId,
  revokeLike,
);

module.exports = cardsRouter;
