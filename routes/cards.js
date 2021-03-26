const cardsRouter = require('express').Router();

const Card = require('../models/card.js');

cardsRouter.get('/', (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err }));
});

cardsRouter.post('/', (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err }));
});

cardsRouter.delete('/:id', (req, res) => {
  const id = req.params._id;

  Card.deleteOne({ id })
    .then(() => res.send({ message: 'Карточка успешно удалена!' }))
    .catch((err) => res.status(500).send({ message: err }));
});

module.exports = cardsRouter;
