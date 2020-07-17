const express = require('express');
// const authRequired = require('../middleware/authRequired');
const Books = require('../models/bookModel');
const router = express.Router();

router.get('/', function (req, res) {
  Books.findAll()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id', function (req, res) {
  const id = String(req.params.id);
  Books.findById(id)
    .then((book) => {
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ error: 'BookNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/', (req, res) => {
  const book = req.body;
  if (book) {
    const id = book.id || 0;
    Books.findBy({ id })
      .first()
      .then((br) => {
        if (br == undefined) {
          //book not found so lets insert it
          Books.create(book)
            .then((book) =>
              res
                .status(200)
                .json({ message: 'book created', profile: book[0] })
            )
            .catch((err) => {
              console.error(err);
              res.status(500).json({ message: err.message });
            });
        } else {
          res.status(400).json({ message: 'book already exists' });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({ message: 'book missing' });
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Books.remove(id)
    .then((deleted) => {
      res
        .status(200)
        .json({ message: `Books '${id}' was deleted.`, book: deleted });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Could not delete Books with ID: ${id}`,
        error: err.message,
      });
    });
});

module.exports = router;
