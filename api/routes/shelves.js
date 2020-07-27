const express = require('express');
// const authRequired = require('../middleware/authRequired');
const Shelves = require('../models/shelfModel');
const Profiles = require('../models/profileModel');
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

// GET all shelves of specified user only

router.get('/profile/:id', function (req, res) {
  const profileId = String(req.params.id);
  // First, check that profileId is for a valid user
  Profiles.findById(profileId)
    .then((pr) => {
      if (pr) {
        // Then, find all shelves belonging to this user
        Shelves.findBy({ profileId })
          .then((shelves) => {
            if (shelves) {
              res.status(200).json(shelves);
            } else {
              res.status(404).json({
                error: `Shelves for user with profile id ${profileId} not found.`,
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              message: `Failure to GET shelves for user with profile id ${profileId}.`,
              error: err.message,
            });
          });
      } else {
        res.status(404).json({ error: 'ProfileNotFound' });
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

router.put('/:id', (req, res) => {
  const id = String(req.params.id);
  const shelfInfo = req.body;
  if (shelfInfo) {
    Shelves.findById(id)
      .then((shelfResponse) => {
        if (shelfResponse == undefined) {
          res.status(400).json({
            message: `Shelf with id ${id} not found.`,
          });
        } else {
          Shelves.update(id, shelfInfo)
            .then((updatedShelf) => {
              res.status(200).json({
                message: `Shelf with id ${id} is updated.`,
                shelf: updatedShelf,
              });
            })
            .catch((err) => {
              res.status(500).json({
                message: `Failure to update shelf with id ${id}`,
                error: err.message,
              });
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message: 'Request body is missing the shelf info needed for an update.',
    });
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Shelves.findById(id)
    .then((shelf) => {
      if (shelf) {
        Shelves.remove(id)
          .then((deleted) => {
            res.status(200).json({
              message: `Shelf with id ${id} was deleted.`,
              count_of_deleted_shelves: deleted,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not delete shelf with id: ${id}`,
              error: err.message,
            });
          });
      } else {
        res.status(404).json({
          error: `Shelf with id ${id} not found.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Shelf with id ${id} not found.`,
        error: err.message,
      });
    });
});

module.exports = router;
