const books = [
  {
    googleId: 'yQRErgEACAAJ',
    title: 'Grokking Algorithms',
    authors: 'Aditya Y. Bhargava',
    publisher: 'Manning Publications',
    publishedDate: '2016-05-25',
    description:
      'Summary Grokking Algorithms is a fully illustrated, friendly guide that teaches you how to apply common algorithms to the practical problems you face every day as a programmer.',
    isbn10: '1617292230',
    isbn13: '9781617292231',
    pageCount: 256,
    categories: 'Computers',
    thumbnail:
      'http://books.google.com/books/content?id=yQRErgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    smallThumbnail:
      'http://books.google.com/books/content?id=yQRErgEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api',
    language: 'en',
    webReaderLink:
      'http://play.google.com/books/reader?id=yQRErgEACAAJ&hl=&printsec=frontcover&source=gbs_api',
    textSnippet:
      'This fully illustrated and engaging guide makes it easy to learn how to use the most important algorithms effectively in your own programs. About the Book Grokking Algorithms is a friendly take on this core computer science topic.',
    buyLink:
      'https://play.google.com/store/books/details?id=7XUSn0IKQEgC&rdid=book-7XUSn0IKQEgC&rdot=1&source=gbs_api',
    publicDomain: false,
    averageRating: 5.0,
  },
  {
    googleId: '9U5I_tskq9MC',
    title: 'Eloquent JavaScript',
    authors: 'Marijn Haverbeke',
  },
  {
    googleId: 'iM_WWZrZsPAC',
    title: 'When Pride Still Mattered',
    authors: 'David Maraniss',
  },
  {
    googleId: 'L5bxPI2YhfEC',
    title: 'Goodnight Moon 60th Anniversary Edition',
    authors: 'Margaret Wise Brown',
  },
  {
    googleId: 'bmx8DwAAQBAJ',
    title: 'Arnie, the Doughnut',
    authors: 'Laurie Keller',
  },
];

exports.seed = function (knex) {
  return knex('books').insert(books);
};
