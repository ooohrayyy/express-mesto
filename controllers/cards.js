const Card = require('../models/card.js');

function getCards(req, res) {
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

function createCard(req, res) {
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

function deleteCard(req, res) {
  Card.findByIdAndDelete(req.params.id)
    .orFail(new Error('Нет карточки с таким ID'))
    .then(() => res.send({ message: 'Карточка успешно удалена!' }))
    .catch((err) => {
      if (err.name === 'CastError' || err.message === 'Нет карточки с таким ID') {
        res.status(404).send({ message: 'Нет карточки с таким ID' });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
}

function putLike(req, res) {
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

function revokeLike(req, res) {
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
