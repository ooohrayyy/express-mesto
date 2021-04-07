const Card = require('../models/card.js');

const { AuthenticationError } = require('../errors/authentication-err.js');
const { EmptyDatabaseError } = require('../errors/empty-database-err.js');
const { IncorrectValueError } = require('../errors/incorrect-value-err.js');
const { NotFoundError } = require('../errors/not-found-err.js');
const { UnauthorizedError } = require('../errors/unauthorized-err.js');

function getCards(req, res) { // Получить все карточки
  Card.find({})
    .orFail(new Error('В базе данных нет карточек'))
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.message === 'В базе данных нет карточек') {
        res.status(200).send({ message: err.message });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function createCard(req, res) { // Создать новую карточку
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены некорректные данные' });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function deleteCard(req, res) { // Удалить карточку по ID
  Card.findById(req.params.id)
    .orFail(new Error('Нет карточки с таким ID'))
    .then((card) => {
      if (req.user._id === String(card.owner)) {
        return Card.findByIdAndDelete(req.params.id)
          .then(() => res.send({ message: 'Карточка успешно удалена!' }));
      }

      return Promise.reject(new Error('У вас нет прав на удаление этой карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Нет карточки с таким ID') {
        res.status(404).send({ message: 'Нет карточки с таким ID' });
      } else if (err.message === 'У вас нет прав на удаление этой карточки') {
        res.status(403).send({ message: err.message });
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function putLike(req, res) { // Поставить лайк карточке
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('Нет карточки с таким ID'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Нет карточки с таким ID') {
        res.status(400).send({ message: 'Нет карточки с таким ID' });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function revokeLike(req, res) { // Снять лайк с карточки
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('Нет карточки с таким ID'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Нет карточки с таким ID') {
        res.status(400).send({ message: 'Нет карточки с таким ID' });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  revokeLike,
};
