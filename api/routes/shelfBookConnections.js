const express = require('express');
// const authRequired = require('../middleware/authRequired');
const shelfBookConnections = require('../models/shelfBookConnectionModel');
const Shelves = require('../models/shelfModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    ShelfBookConnections:
 *      type: object
 *      required:
 *        - id
 *        - ShelfId
 *        - ConnectionId
 *      properties:
 *        id:
 *          type: integer
 *          description: auto-generated id
 *        ShelfId:
 *          type: integer
 *          description: id of shelf
 *        ConnectionId:
 *          type: integer
 *          description: id of profile-book connection
 *      example:
 *        id: 1
 *        ShelfId: 1
 *        ConnectionId: 1
 */

/**
 * @swagger
 *  /organize:
 *   get:
 *    description: Returns a list of shelf-book connections
 *    summary: Get a list of all shelf-book connections
 *    tags:
 *      - shelfBookConnections
 *    responses:
 *      200:
 *        description: array of shelf-book connections
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ShelfBookConnections'
 *              example:
 *                - id: 1
 *                  ShelfId: 1
 *                  ConnectionId: 1
 *                - id: 2
 *                  ShelfId: 3
 *                  ConnectionId: 10
 *        500:
 *         description: 'Failure to GET shelf-book connections'
 */

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

/**
 * @swagger
 * components:
 *  parameters:
 *    id:
 *      name: id
 *      in: path
 *      description: ID of the shelf-book connection to return
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 *
 * /organize/{id}:
 *  get:
 *    description: Find shelf-book connections by ID
 *    summary: Returns a single shelf-book connection
 *    tags:
 *      - shelfBookConnections
 *    parameters:
 *      - $ref: '#/components/parameters/id'
 *    responses:
 *      200:
 *        description: A shelf-book connection object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ShelfBookConnections'
 *      404:
 *        description: 'Shelf-book connection with id ${id} not found.'
 *      500:
 *        description: 'Failure to GET shelf-book connection with id ${id}.'
 */

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
