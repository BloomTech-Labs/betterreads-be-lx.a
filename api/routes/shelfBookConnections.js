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

/**
 * @swagger
 * components:
 *  parameters:
 *    shelfId:
 *      name: shelfId
 *      in: path
 *      description: ID of the shelf
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 *
 * /organize/shelf/{shelfId}:
 *  get:
 *    description: Find shelf-book connections for a specified shelf
 *    summary: Returns shelf-book connections for a specified shelf
 *    tags:
 *      - shelfBookConnections
 *    parameters:
 *      - $ref: '#/components/parameters/shelfId'
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
 *                  ShelfId: 4
 *                  ConnectionId: 3
 *      404:
 *        description: 'Shelf-book connections where ShelfId is ${ShelfId} are not found, or shelf with ShelfId ${ShelfId} was not found.'
 *      500:
 *        description: 'Failure to GET shelf-book connections where ShelfId is ${ShelfId}.'
 */

router.get('/shelf/:shelfId', function (req, res) {
  const ShelfId = String(req.params.shelfId);
  Shelves.findById(ShelfId).then((shelfResponse) => {
    if (shelfResponse) {
      shelfBookConnections
        .findByShelfId(ShelfId)
        .then((connections) => {
          if (connections.length > 0) {
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
        error: `Failure to GET shelf-book connections because shelf with ShelfId ${ShelfId} was not found.`,
      });
    }
  });
});

/**
 * @swagger
 * /organize:
 *  post:
 *    summary: Add a shelf-book connection
 *    tags:
 *      - shelfBookConnections
 *    requestBody:
 *      description: Shelf-book connection object to to be added
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ShelfBookConnections'
 *    responses:
 *      500:
 *        description: 'Failure to create new shelf-book connection'
 *      400:
 *        description: 'Failure because connection between shelf and book already exists'
 *      200:
 *        description: An object containing both a message and a shelf-book connection object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: 'shelf-book connection created'
 *                connection:
 *                  $ref: '#/components/schemas/ShelfBookConnections'
 */

router.post('/:shelfId/:profileBookConnectionId', async (req, res) => {
  const ShelfId = String(req.params.shelfId);
  const ConnectionId = String(req.params.profileBookConnectionId);

  try {
    await shelfBookConnections
      .duplicateCheck(ShelfId, ConnectionId)
      .then(async (connectionResult) => {
        console.log(connectionResult);
        if (connectionResult.length < 1) {
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
            message: `shelf-book connection with id ${connectionResult[0].id} already exists`,
          });
        }
      });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      message: 'Failure to create new shelf-book connection',
    });
  }
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
