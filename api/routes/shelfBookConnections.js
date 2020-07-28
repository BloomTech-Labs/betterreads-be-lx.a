const express = require('express');
// const authRequired = require('../middleware/authRequired');
const shelfBookConnections = require('../models/shelfBookConnectionModel');
const Shelves = require('../models/shelfModel');
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

// To GET the shelf-book connections for a specified shelf

router.get('/shelf/:shelfId', function (req, res) {
  const ShelfId = String(req.params.shelfId);
  Shelves.findById(ShelfId).then((shelfResponse) => {
    if (shelfResponse) {
      shelfBookConnections
        .findBy({ ShelfId })
        .then((connections) => {
          if (connections) {
            res.status(200).json(connections);
          } else {
            res.status(404).json({
              error: `Shelf-book connections where ShelfId is ${ShelfId} are not found.`,
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            message: `Failure to GET shelf-book connections where ShelfId is ${ShelfId}.`,
            error: err.message,
          });
        });
    } else {
      res.status(404).json({
        error: `Shelf with ShelfId ${ShelfId} was not found.`,
      });
    }
  });
});

router.post('/:shelfId/:profileBookConnectionId', async (req, res) => {
  const ShelfId = String(req.params.shelfId);
  const ConnectionId = String(req.params.profileBookConnectionId);

  try {
    await shelfBookConnections
      .findBy({ ShelfId, ConnectionId })
      .first()
      .then(async (connectionResult) => {
        if (connectionResult == undefined) {
          // shelf-book connection not found, so let's create it:
          await shelfBookConnections
            .create({ ShelfId, ConnectionId })
            .then((newConnection) => {
              res.status(200).json({
                message: 'shelf-book connection created',
                connection: newConnection,
              });
            });
        } else {
          res.status(400).json({
            message: `shelf-book connection with id ${connectionResult.id} already exists`,
          });
        }
      });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  try {
    shelfBookConnections.findById(id).then(async (connection) => {
      if (connection) {
        await shelfBookConnections.remove(id).then((deleted) => {
          res.status(200).json({
            message: `Shelf-book connection with id ${id} was deleted.`,
            count_of_deleted_connections: deleted,
          });
        });
      } else {
        res.status(404).json({
          error: `Shelf-book connection with id ${id} not found.`,
        });
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
