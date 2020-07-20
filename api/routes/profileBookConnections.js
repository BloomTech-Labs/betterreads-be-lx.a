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

module.exports = router;
