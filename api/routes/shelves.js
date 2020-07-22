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

module.exports = router;
