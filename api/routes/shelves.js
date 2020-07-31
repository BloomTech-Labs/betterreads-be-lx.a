const express = require('express');
// const authRequired = require('../middleware/authRequired');
const Shelves = require('../models/shelfModel');
const Profiles = require('../models/profileModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Shelf:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - profileId
 *      properties:
 *        id:
 *          type: integer
 *          description: Shelf id
 *        name:
 *          type: string
 *        profileId:
 *          type: integer
 *      example:
 *        id: 1
 *        name: "Book Club"
 *        profileId: 1
 *
 * /shelves:
 *  get:
 *    description: Returns a list of shelves
 *    summary: Get a list of all shelves
 *    tags:
 *      - shelf
 *    responses:
 *      200:
 *        description: array of shelves
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Shelf'
 *              example:
 *                - id: 1
 *                  name: "Book Club"
 *                  profileId: 1
 *                - id: 2
 *                  name: "Owned"
 *                  profileId: 1
 */
router.get('/', function (req, res) {
  Shelves.findAll()
    .then((shelves) => {
      res.status(200).json(shelves);
    })
    .catch((err) => {
      // console.error(err);
      res.status(500).json({ message: err.message });
    });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    shelfId:
 *      name: id
 *      in: path
 *      description: ID of the shelf to return
 *      required: true
 *      example: 1
 *      schema:
 *        type: string
 * /shelves/{id}:
 *  get:
 *    description: Returns a list of shelves
 *    summary: Get a list of all shelves
 *    tags:
 *      - shelf
 *    parameters:
 *      - $ref: '#/components/parameters/shelfId'
 *    responses:
 *      200:
 *        description: shelf object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Shelf'
 *              example:
 *                  id: 1
 *                  name: "Book Club"
 *                  profileId: 1
 */
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
      res.status(500).json({ message: err.message });
    });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    userId:
 *      name: userId
 *      in: path
 *      description: ID of the user profile
 *      required: true
 *      example: 1
 *      schema:
 *        type: string
 * /shelves/profile/{userId}:
 *  get:
 *    description: Returns a list of shelves for a specific user
 *    summary: Get a list of users shelves
 *    tags:
 *      - shelf
 *    parameters:
 *      - $ref: '#/components/parameters/userId'
 *    responses:
 *      200:
 *        description: array of shelf objects
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Shelf'
 *              example:
 *                - id: 1
 *                  name: "Book Club"
 *                  profileId: 1
 *                - id: 2
 *                  name: "Owned"
 *                  profileId: 1
 */
router.get('/profile/:userId', function (req, res) {
  const profileId = String(req.params.userId);
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

/**
 * @swagger
 * /shelves:
 *  post:
 *    description: Create a new shelf
 *    summary: Get a list of users shelves
 *    tags:
 *      - shelf
 *    parameters:
 *      - $ref: '#/components/parameters/userId'
 *    responses:
 *      200:
 *        description: array of shelf objects
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Shelf'
 *              example:
 *                - id: 1
 *                  name: "Book Club"
 *                  profileId: 1
 *                - id: 2
 *                  name: "Owned"
 *                  profileId: 1
 */
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
