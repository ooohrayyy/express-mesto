const Card = require('../models/card.js');

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));
}

function deleteCard(req, res) {
  const id = req.params._id;

  Card.deleteOne({ id })
    .then(() => res.send({ message: 'Карточка успешно удалена!' }))
    .catch((err) => res.status(500).send({ message: err }));
}

function putLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));
}

function revokeLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  revokeLike,
};
