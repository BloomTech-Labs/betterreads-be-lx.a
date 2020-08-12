const db = require('../../data/db-config');

const findAll = async () => {
  return await db('profiles');
};

const findBy = (filter) => {
  return db('profiles').where(filter);
};

const findById = async (id) => {
  return db('profiles')
    .where({ id })
    .first()
    .select('id', 'email', 'name', 'avatarUrl');
};

const profileLibrary = async (id) => {
  return db('profiles')
    .where({ id })
    .first()
    .select('id', 'email', 'name', 'avatarUrl')
    .then((user) => {
      return db('shelves')
        .where('shelves.profileId', id)
        .select('id', 'name')
        .then((shelves) => {
          return db('shelves')
            .join('shelf_book_connections AS sbc', 'sbc.ShelfId', 'shelves.id')
            .join('profile_book_connections AS pbc', 'pbc.id', 'sbc.ConnectionId')
            .join('books', 'books.id', 'pbc.bookId')
            .where('shelves.profileId', id)
            .select('sbc.ShelfId', 'sbc.ConnectionId', 'pbc.readingStatus', 'pbc.dateStarted', 'pbc.dateFinished', 'pbc.dateAdded', 'pbc.favorite', 'pbc.personalRating', 'googleId', 'title', 'authors', 'publisher', 'publishedDate', 'description', 'isbn10', 'isbn13', 'pageCount', 'categories', 'thumbnail', 'smallThumbnail', 'language', 'webReaderLink', 'textSnippet', 'buyLink', 'publicDomain', 'averageRating')
            .then((books) => {
              return { user, shelves, books }
            });
        });
    });
};

const create = async (profile) => {
  return db('profiles').insert(profile).returning('*');
};

const update = (id, profile) => {
  console.log(profile);
  return db('profiles')
    .where({ id: id })
    .first()
    .update(profile)
    .returning('*');
};

const remove = async (id) => {
  return await db('profiles').where({ id }).del();
};

module.exports = { findAll, findBy, findById, profileLibrary, create, update, remove };
