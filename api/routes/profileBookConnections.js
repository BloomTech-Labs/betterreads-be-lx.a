const express = require('express');
// const authRequired = require('../middleware/authRequired');
const Connections = require('../models/profileBookConnectionModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    ProfileBookConnections:
 *      type: object
 *      required:
 *        - id
 *        - profileId
 *        - bookId
 *        - readingStatus
 *      properties:
 *        id:
 *          type: integer
 *          description: auto-generated id
 *        profileId:
 *          type: integer
 *          description: id of user
 *        bookId:
 *          type: integer
 *          description: id of book
 *        readingStatus:
 *          type: integer
 *          description: integer representing reading status. Look up in readingOptions table.
 *        dateStarted:
 *          type: datetime
 *          description: when user started reading book
 *        dateFinished:
 *          type: datetime
 *          description: when user finished reading book
 *        dateAdded:
 *          type: datetime
 *          description: when connection was created
 *        favorite:
 *          type: boolean
 *          description: whether or not user considers book to be a favorite
 *        personalRating:
 *          type: decimal
 *          description: user's rating between 0-5
 *      example:
 *        profileId: 1
 *        bookId: 1
 *        readingStatus: 3
 *        dateStarted: "2015-01-04T02:14:06.585Z"
 *        dateFinished: "2015-02-02T03:15:08.450Z"
 *        dateAdded: "2014-01-01T05:38:18.365Z"
 *        favorite: true
 *        personalRating: 5.0
 *
 */

/**
 * @swagger
 *  /connect:
 *   get:
 *    description: Returns a list of profile-book connections
 *    summary: Get a list of all profile-book connections
 *    tags:
 *      - profileBookConnections
 *    responses:
 *      200:
 *        description: array of profile-book connections
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ProfileBookConnections'
 *              example:
 *                - id: 1
 *                  profileId: 1
 *                  bookId: 1
 *                  readingStatus: 3
 *                  dateStarted: "2015-01-04T02:14:06.585Z"
 *                  dateFinished: "2015-02-02T03:15:08.450Z"
 *                  dateAdded: "2014-01-01T05:38:18.365Z"
 *                  favorite: true
 *                  personalRating: 5.0
 *                - id: 3
 *                  profileId: 2
 *                  bookId: 3
 *        500:
 *         description: 'Failure to GET profile-book connections'
 */

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

/**
 * @swagger
 * components:
 *  parameters:
 *    id:
 *      name: id
 *      in: path
 *      description: ID of the profile-book connection to return
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 *
 * /connect/{id}:
 *  get:
 *    description: Find profile-book connections by ID
 *    summary: Returns a single profile-book connection
 *    tags:
 *      - profileBookConnections
 *    parameters:
 *      - $ref: '#/components/parameters/id'
 *    responses:
 *      200:
 *        description: A profile-book connection object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProfileBookConnections'
 *      404:
 *        description: 'Profile-book connection with id ${id} not found.'
 *      500:
 *        description: 'Failure to GET profile-book connection with id ${id}.'
 */

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

// To only GET the connections for a specified user

/**
 * @swagger
 * components:
 *  parameters:
 *    id:
 *      name: id
 *      in: path
 *      description: ID of the profile
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 *
 * /connect/profile/{id}:
 *  get:
 *    description: Find profile-book connections for a specified user
 *    summary: Returns profile-book connections for a specified user
 *    tags:
 *      - profileBookConnections
 *    parameters:
 *      - $ref: '#/components/parameters/id'
 *    responses:
 *      200:
 *        description: array of profile-book connections
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ProfileBookConnections'
 *              example:
 *                - id: 1
 *                  profileId: 1
 *                  bookId: 1
 *                  readingStatus: 3
 *                  dateStarted: "2015-01-04T02:14:06.585Z"
 *                  dateFinished: "2015-02-02T03:15:08.450Z"
 *                  dateAdded: "2014-01-01T05:38:18.365Z"
 *                  favorite: true
 *                  personalRating: 5.0
 *                - id: 7
 *                  profileId: 1
 *                  bookId: 3
 *      404:
 *        description: 'Profile-book connections with profile id ${profileId} not found.'
 *      500:
 *        description: 'Failure to GET profile-book connections with profile id ${profileId}.'
 */

router.get('/profile/:id', function (req, res) {
  const profileId = String(req.params.id);
  Connections.findBy({ profileId })
    .then((connections) => {
      if (connections) {
        res.status(200).json(connections);
      } else {
        res.status(404).json({
          error: `Profile-book connections with profile id ${profileId} not found.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Failure to GET profile-book connections with profile id ${profileId}.`,
        error: err.message,
      });
    });
});

/**
 * @swagger
 * /connect:
 *  post:
 *    summary: Add a profile-book connection
 *    tags:
 *      - profileBookConnections
 *    requestBody:
 *      description: Profile-book connection object to to be added
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProfileBookConnections'
 *    responses:
 *      500:
 *        description: 'Failure to create new profile-book connection'
 *      400:
 *        description: 'Failure because connection between profile and user already exists, or because info is missing from request body'
 *      200:
 *        description: An object containing both a message and a profile-book connection object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: 'profile-book connection created'
 *                connection:
 *                  $ref: '#/components/schemas/ProfileBookConnections'
 */

// Required in request body: profileId, bookId, and readingStatus (an integer, 1-3)
router.post('/', (req, res) => {
  const connection = req.body;
  console.log(connection);
  if (connection) {
    const profileId = connection.profileId || 0;
    const bookId = connection.bookId || 0;
    Connections.findBy({ profileId, bookId })
      .first()
      .then((connectionResult) => {
        if (connectionResult == undefined) {
          // Profile-book connection not found, so let's create it:
          Connections.create(connection)
            .then((newConnection) => {
              res.status(200).json({
                message: 'profile-book connection created',
                connection: newConnection,
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

/**
 * @swagger
 *  components:
 *   parameters:
 *    id:
 *      name: id
 *      in: path
 *      description: ID of the profile-book connection to update
 *      required: true
 *      example: 1
 *      schema:
 *        type: integer
 *
 * /connect/{id}:
 *  put:
 *    summary: Update a profile-book connection
 *    tags:
 *      - profileBookConnections
 *    requestBody:
 *      description: Profile-book connection object to to be updated
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ProfileBookConnections'
 *    responses:
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: An object containing a message and a profile-book connection object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: 'Profile-book connection with id ${id} is updated.'
 *                profile:
 *                  $ref: '#/components/schemas/ProfileBookConnections'
 */

router.put('/:id', (req, res) => {
  const id = String(req.params.id);
  const connectionInfo = req.body;
  if (connectionInfo) {
    Connections.findById(id)
      .then((connectionResponse) => {
        if (connectionResponse == undefined) {
          res.status(400).json({
            message: `Profile-book connection with id ${id} not found.`,
          });
        } else {
          Connections.update(id, connectionInfo)
            .then((updatedConnection) => {
              res.status(200).json({
                message: `Profile-book connection with id ${id} is updated.`,
                connection: updatedConnection,
              });
            })
            .catch((err) => {
              res.status(500).json({
                message: `Failure to update profile-book connection with id ${id}`,
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
      message:
        'Request body is missing the connection info needed for an update.',
    });
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Connections.findById(id)
    .then((connection) => {
      if (connection) {
        Connections.remove(id)
          .then((deleted) => {
            res.status(200).json({
              message: `Profile-book connection with id ${id} was deleted.`,
              count_of_deleted_connections: deleted,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not delete profile-book connection with id: ${id}`,
              error: err.message,
            });
          });
      } else {
        res.status(404).json({
          error: `Profile-book connection with id ${id} not found.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: `Profile-book connection with id ${id} not found.`,
        error: err.message,
      });
    });
});

module.exports = router;
