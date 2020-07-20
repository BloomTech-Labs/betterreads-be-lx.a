const express = require('express');
// const authRequired = require('../middleware/authRequired');
const Connections = require('../models/profileBookConnectionModel');
const router = express.Router();

router.get('/', function (req, res) {
  Connections.findAll()
    .then((connections) => {
      res.status(200).json(connections);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Failure to GET profile-book connections',
        error: err.message,
      });
    });
});

router.get('/:id', function (req, res) {
  const id = String(req.params.id);
  Connections.findById(id)
    .then((connection) => {
      if (connection) {
        res.status(200).json(connection);
      } else {
        res
          .status(404)
          .json({ error: `Profile-book connection with id ${id} not found.` });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Failure to GET profile-book connection with id ${id}.`,
        error: err.message,
      });
    });
});

// Required in request body: profileId, bookId, and readingStatus (an integer, 1-3)
router.post('/', (req, res) => {
  const connection = req.body;
  if (connection) {
    const profileId = connection.profileId || 0;
    const bookId = connection.bookId || 0;
    const id = connection.id || 0;
    Connections.findBy({ profileId, bookId })
      .first()
      .then((connectionResult) => {
        if (connectionResult == undefined) {
          // Profile-book connection not found, so let's create it:
          Connections.create(connection)
            .then((newConnection) => {
              res.status(200).json({
                message: 'profile-book connection created',
                book: newConnection,
              });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({
                message: 'Failure to create new profile-book connection',
                error: err.message,
              });
            });
        } else {
          res.status(400).json({
            message: `Profile-book connection with id ${connectionResult.id} already exists`,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message:
        'Failure to create profile-book connection because info is missing in request body.',
    });
  }
});

module.exports = router;
