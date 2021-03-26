const Card = require('../models/card.js');

function getCards(req, res) {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.send({ message: 'В базе данных нет карточек' });
        return;
      }

      res.send({ data: cards });
    })
    .catch((err) => res.status(500).send({ message: err }));
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

      res.status(500).send({ message: err });
    });
}

function deleteCard(req, res) {
  Card.findByIdAndDelete(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким ID' });
        return;
      }

      res.send({ message: 'Карточка успешно удалена!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный ID карточки' });
        return;
      }

      res.status(500).send({ message: err });
    });
}

function putLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким ID' });
        return;
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный ID карточки' });
        return;
      }

      res.status(500).send({ message: err });
    });
}

function revokeLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким ID' });
        return;
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный ID карточки' });
        return;
      }

      res.status(500).send({ message: err });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  revokeLike,
};
