const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
  let queryBody = req.body.query;
  queryBody = queryBody.replace(/ /g, '+');
  const query = 'https://www.googleapis.com/books/v1/volumes?q=' + queryBody;
  console.log(query);
  axios
    .get(query)
    .then((response) => {
      const first_ten = response.data.items.slice(0, 10);
      const first_ten_parsed = first_ten.map((book) => {
        return {
          googleId: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors,
        };
      });
      res.status(200).json({
        first_ten: first_ten_parsed,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Failure to get Google Books API result with ${queryBody}`,
        error: err.message,
      });
    });
});

module.exports = router;
