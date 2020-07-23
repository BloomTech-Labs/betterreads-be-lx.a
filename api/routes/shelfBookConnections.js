const express = require('express');
// const authRequired = require('../middleware/authRequired');
const shelfBookConnections = require('../models/shelfBookConnectionModel');
const router = express.Router();

router.get('/', function (req, res) {
  shelfBookConnections
    .findAll()
    .then((connections) => {
      res.status(200).json(connections);
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Failure to GET shelf-book connections',
        error: err.message,
      });
    });
});

router.get('/:id', function (req, res) {
  const id = String(req.params.id);
  shelfBookConnections
    .findById(id)
    .then((connection) => {
      if (connection) {
        res.status(200).json(connection);
      } else {
        res
          .status(404)
          .json({ error: `Shelf-book connection with id ${id} not found.` });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Failure to GET shelf-book connection with id ${id}.`,
        error: err.message,
      });
    });
});

router.post('/:shelfId/:profileBookConnectionId', (req, res) => {
  const ShelfId = String(req.params.shelfId);
  const ConnectionId = String(req.params.profileBookConnectionId);
  shelfBookConnections
    .findBy({ ShelfId, ConnectionId })
    .first()
    .then((connectionResult) => {
      if (connectionResult == undefined) {
        // shelf-book connection not found, so let's create it:
        shelfBookConnections
          .create({ ShelfId, ConnectionId })
          .then((newConnection) => {
            res.status(200).json({
              message: 'shelf-book connection created',
              connection: newConnection,
            });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({
              message: 'Failure to create new shelf-book connection',
              error: err.message,
            });
          });
      } else {
        res.status(400).json({
          message: `shelf-book connection with id ${connectionResult.id} already exists`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  shelfBookConnections
    .findById(id)
    .then((connection) => {
      if (connection) {
        shelfBookConnections
          .remove(id)
          .then((deleted) => {
            res.status(200).json({
              message: `Shelf-book connection with id ${id} was deleted.`,
              count_of_deleted_connections: deleted,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not delete shelf-book connection with id: ${id}`,
              error: err.message,
            });
          });
      } else {
        res.status(404).json({
          error: `Shelf-book connection with id ${id} not found.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Shelf-book connection with id ${id} not found.`,
        error: err.message,
      });
    });
});
module.exports = router;
