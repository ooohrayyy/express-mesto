const Card = require('../models/card.js');

const EmptyDatabaseError = require('../errors/empty-database-err.js');
const IncorrectValueError = require('../errors/incorrect-value-err.js');
const NotFoundError = require('../errors/not-found-err.js');
const ForbiddenError = require('../errors/forbidden-err.js');

function getCards(req, res, next) { // Получить все карточки
  Card.find({})
    .orFail(new EmptyDatabaseError('В базе данных нет карточек'))
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
}

function createCard(req, res, next) { // Создать новую карточку
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectValueError('Введены некорректные данные'));
      }

      next(err);
    });
}

function deleteCard(req, res, next) { // Удалить карточку по ID
  Card.findById(req.params.id)
    .orFail(new NotFoundError('Нет карточки с таким ID'))
    .then((card) => {
      if (req.user._id === String(card.owner)) {
        return Card.findByIdAndDelete(req.params.id)
          .then(() => res.send({ message: 'Карточка успешно удалена!' }));
      }

      throw new ForbiddenError('У вас нет прав на удаление этой карточки');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет карточки с таким ID'));
      }

      next(err);
    });
}

function putLike(req, res, next) { // Поставить лайк карточке
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new NotFoundError('Нет карточки с таким ID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет карточки с таким ID'));
      }

      next(err);
    });
}

function revokeLike(req, res, next) { // Снять лайк с карточки
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new NotFoundError('Нет карточки с таким ID'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Нет карточки с таким ID'));
      }

      next(err);
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  revokeLike,
};
