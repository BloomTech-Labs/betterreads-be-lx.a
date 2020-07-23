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
      const firstTenParsed = response.data.items.map((book) => {
        return {
          googleId: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors
            ? book.volumeInfo.authors.join(', ')
            : '',
        };
      });
      res.status(200).json({
        totalItems: response.data.totalItems,
        returnedItemsLength: response.data.items.length,
        firstTen: firstTenParsed,
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
