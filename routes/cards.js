const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  revokeLike,
} = require('../controllers/cards.js');

cardsRouter.get('/', getCards); // Получить все карточки

cardsRouter.post( // Создать карточку
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required(),
    }),
  }),
  createCard,
);

cardsRouter.delete( // Удалить карточку по ID
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  deleteCard,
);

cardsRouter.put( // Поставить лайк карточке
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required(),
    }),
  }),
  putLike,
);

cardsRouter.delete( // Снять лайк с карточки
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required(),
    }),
  }),
  revokeLike,
);

module.exports = cardsRouter;
