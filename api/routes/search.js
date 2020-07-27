const express = require('express');
const router = express.Router();
const axios = require('axios');

// In request body, one or more of the following must be present:
//  searchTerms, exactPhrase, title, isbn, or author.
// startIndex, maxResults, and exclude are optional.
// Default maxResults is 10.
// Default startIndex is 0.

router.get('/', (req, res) => {
  let searchTerms = req.body.searchTerms;
  if (searchTerms) {
    searchTerms = searchTerms.replace(/ /g, '+');
  }

  const startIndex = req.body.startIndex;
  let maxResults = req.body.maxResults;
  let exactPhrase = req.body.exactPhrase;
  if (exactPhrase) {
    exactPhrase = '"' + exactPhrase.replace(/ /g, '+') + '"';
  }
  const author = req.body.author;
  const title = req.body.title;
  const isbn = req.body.isbn;
  const exclude = req.body.exclude;

  let query = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (searchTerms && exactPhrase) {
    query += exactPhrase + '+' + searchTerms;
  } else if (searchTerms) {
    query += searchTerms;
  } else if (exactPhrase) {
    query += exactPhrase;
  }

  if (exclude) {
    const excludeArray = exclude.split(' ');
    for (let i = 0; i < excludeArray.length; i++) {
      query += '-' + excludeArray[i];
    }
  }

  if (author) {
    const authorArray = author.split(' ');
    if (!exactPhrase && !searchTerms && !title && !exclude && !isbn) {
      query += 'inauthor:' + authorArray[0];
      for (let i = 1; i < authorArray.length; i++) {
        query += '+inauthor:' + authorArray[i];
      }
    } else {
      for (let i = 0; i < authorArray.length; i++) {
        query += '+inauthor:' + authorArray[i];
      }
    }
  }

  if (title) {
    const titleArray = title.split(' ');
    if (!exactPhrase && !searchTerms && !author && !exclude && !isbn) {
      query += 'intitle:' + titleArray[0];
      for (let i = 1; i < titleArray.length; i++) {
        query += '+intitle:' + titleArray[i];
      }
    } else {
      for (let i = 0; i < titleArray.length; i++) {
        query += '+intitle:' + titleArray[i];
      }
    }
  }

  if (isbn) {
    if (!exactPhrase && !searchTerms && !author && !exclude) {
      query += 'isbn:' + isbn;
    } else {
      query += '+isbn:' + isbn;
    }
  }

  if (startIndex) {
    query += '&startIndex=' + startIndex;
  }

  if (maxResults > 40) {
    maxResults = 40;
  }
  if (maxResults) {
    query += '&maxResults=' + maxResults;
  }

  axios
    .get(query)
    .then((response) => {
      const responseParsed = response.data.items.map((book) => {
        let isbn10 = '';
        let isbn13 = '';
        if (book.volumeInfo.industryIdentifiers) {
          for (let i = 0; i < book.volumeInfo.industryIdentifiers.length; i++) {
            if (book.volumeInfo.industryIdentifiers[i].type === 'ISBN_10') {
              isbn10 = book.volumeInfo.industryIdentifiers[i].identifier;
            } else if (
              book.volumeInfo.industryIdentifiers[i].type === 'ISBN_13'
            ) {
              isbn13 = book.volumeInfo.industryIdentifiers[i].identifier;
            }
          }
        }
        return {
          googleId: book.id ? book.id : '',
          title:
            book.volumeInfo && book.volumeInfo.title
              ? book.volumeInfo.title
              : '',
          authors:
            book.volumeInfo && book.volumeInfo.authors
              ? book.volumeInfo.authors.join(', ')
              : '',
          publisher:
            book.volumeInfo && book.volumeInfo.publisher
              ? book.volumeInfo.publisher
              : '',
          publishedDate:
            book.volumeInfo && book.volumeInfo.publishedDate
              ? book.volumeInfo.publishedDate
              : '',
          description:
            book.volumeInfo && book.volumeInfo.description
              ? book.volumeInfo.description
              : '',
          pageCount:
            book.volumeInfo && book.volumeInfo.pageCount
              ? book.volumeInfo.pageCount
              : '',
          categories:
            book.volumeInfo && book.volumeInfo.categories
              ? book.volumeInfo.categories.join(', ')
              : '',
          thumbnail:
            book.volumeInfo &&
            book.volumeInfo.imageLinks &&
            book.volumeInfo.imageLinks.thumbnail
              ? book.volumeInfo.imageLinks.thumbnail
              : '',
          smallThumbnail:
            book.volumeInfo &&
            book.volumeInfo.imageLinks &&
            book.volumeInfo.imageLinks.smallThumbnail
              ? book.volumeInfo.imageLinks.smallThumbnail
              : '',
          language:
            book.volumeInfo && book.volumeInfo.language
              ? book.volumeInfo.language
              : '',
          webReaderLink:
            book.accessInfo && book.accessInfo.webReaderLink
              ? book.accessInfo.webReaderLink
              : '',
          textSnippet:
            book.searchInfo && book.searchInfo.textSnippet
              ? book.searchInfo.textSnippet
              : '',
          buyLink:
            book.saleInfo && book.saleInfo.buyLink ? book.saleInfo.buyLink : '',
          publicDomain:
            book.accessInfo && book.accessInfo.publicDomain
              ? book.accessInfo.publicDomain
              : false,
          averageRating:
            book.volumeInfo && book.volumeInfo.averageRating
              ? book.volumeInfo.averageRating
              : null,
          isbn10,
          isbn13,
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
        message: 'Failure to get Google Books API result.',
        error: err.message,
      });
    });
});

module.exports = router;
