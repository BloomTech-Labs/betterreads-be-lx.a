const express = require('express');
const router = express.Router();
const axios = require('axios');

// In request body, query is required. startIndex and maxResults are optional.
// Default maxResults is 10.
// Default startIndex is 0.
router.get('/', (req, res) => {
  let queryBody = req.body.query;
  const startIndex = req.body.startIndex;
  let maxResults = req.body.maxResults;
  queryBody = queryBody.replace(/ /g, '+');
  let query = 'https://www.googleapis.com/books/v1/volumes?q=' + queryBody;
  if (startIndex) {
    query += '&startIndex=' + startIndex;
  }
  if (maxResults > 40) {
    maxResults = 40;
  }
  if (maxResults) {
    query += '&maxResults=' + maxResults;
  }
  console.log(query);
  axios
    .get(query)
    .then((response) => {
      const responseParsed = response.data.items.map((book) => {
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
        results: responseParsed,
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
