const express = require('express');
// const authRequired = require('../middleware/authRequired');
const Books = require('../models/bookModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *        - googleId
 *        - title
 *        - authors
 *      properties:
 *        googleId:
 *          type: string
 *          description: google books API id
 *        title:
 *          type: string
 *        authors:
 *          type: string
 *      example:
 *        googleId: 'hFfhrCWiLSMC'
 *        title: 'The Hobbit, Or, There and Back Again'
 *        authors: 'John Ronald Reuel Tolkien'
 *
 * /books:
 *  get:
 *    description: Returns a list of books
 *    summary: Get a list of all books
 *    tags:
 *      - book
 *    responses:
 *      200:
 *        description: array of books
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Book'
 *              example:
 *                - googleId: 'hFfhrCWiLSMC'
 *                  title: 'The Hobbit, Or, There and Back Again'
 *                  authors: 'John Ronald Reuel Tolkien'
 *                - googleId: '5QRZ4z6A1WwC'
 *                  title: 'The Fellowship of the Ring'
 *                  authors: 'John Ronald Reuel Tolkien and Alan Lee'
 */

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

/**
 * @swagger
 *  /books/:id:
 *  get:
 *    description: Returns requested book by ID
 *    summary: Retrieve information on a selected book
 *    tags:
 *      - book
 *    responses:
 *      200:
 *        description: object - book
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Book'
 *              example:
 *                - googleId: 'hFfhrCWiLSMC'
 *                  title: 'The Hobbit, Or, There and Back Again'
 *                  authors: 'John Ronald Reuel Tolkien'
 */

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

/**
 * @swagger
 * /books
 *  post:
 *    summary: Add a book
 *    tags:
 *      - books
 *    requestBody:
 *      description: Book object to be added
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Books'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/Unauthorized Error'
 *      201:
 *        description: A book object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description:
 *      500:
 *
 */

router.post('/', async (req, res) => {
  const book = req.body;
  if (book) {
    const id = book.id || 0;
    try {
      await Books.findBy({ id })
        .first()
        .then((br) => {
          if (br == undefined) {
            //book not found so lets insert it
            Books.create(book).then(async (book) => {
              res.status(200).json({ message: 'book created', book: book });
            });
          } else {
            res.status(400).json({ message: 'book already exists' });
          }
        });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
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
