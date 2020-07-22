const express = require('express');
// const authRequired = require('../middleware/authRequired');
const Shelves = require('../models/shelfModel');
const router = express.Router();

router.get('/', function (req, res) {
  Shelves.findAll()
    .then((shelves) => {
      res.status(200).json(shelves);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id', function (req, res) {
  const id = String(req.params.id);
  Shelves.findById(id)
    .then((shelf) => {
      if (shelf) {
        res.status(200).json(shelf);
      } else {
        res.status(404).json({ error: 'ShelfNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/', (req, res) => {
  const shelf = req.body;
  if (shelf) {
    const id = shelf.id || 0;
    Shelves.findBy({ id })
      .first()
      .then((sr) => {
        if (sr == undefined) {
          //shelf not found so let's insert it
          Shelves.create(shelf)
            .then((created_shelf) => {
              res
                .status(200)
                .json({ message: 'shelf created', shelf: created_shelf });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ message: err.message });
            });
        } else {
          res.status(400).json({ message: 'shelf already exists' });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({ message: 'shelf info is missing in request body' });
  }
});

module.exports = router;
