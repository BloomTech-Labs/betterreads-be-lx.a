const faker = require('faker');

const connections = [
  {
    profileId: 1,
    bookId: 1,
    readingStatus: 3,
    dateStarted: faker.date.between('2015-01-01', '2015-01-05'),
    dateFinished: faker.date.between('2015-02-01', '2015-02-05'),
    dateAdded: faker.date.between('2014-01-01', '2014-01-05'),
    favorite: true,
    personalRating: 5.0,
  },
  {
    profileId: 2,
    bookId: 2,
    readingStatus: 1,
    dateAdded: faker.date.between('2020-05-01', '2020-05-05'),
  },
  {
    profileId: 2,
    bookId: 3,
    readingStatus: 1,
    dateAdded: faker.date.between('2020-05-01', '2020-05-05'),
  },
  {
    profileId: 3,
    bookId: 4,
    readingStatus: 2,
    dateAdded: faker.date.between('2020-05-01', '2020-05-05'),
    dateStarted: faker.date.between('2020-06-01', '2020-06-05'),
  },
];

exports.seed = function (knex) {
  return knex('profile_book_connections').insert(connections);
};
