const db = require('../../data/db-config');

const findAll = async () => {
  return await db('shelves');
};

const findBy = (filter) => {
  return db('shelves').where(filter);
};

const findById = async (id) => {
  return db('shelves').where({ id }).first().select('*');
};

const create = async (shelf) => {
  const [id] = await db('shelves').insert(shelf).returning('id');
  return findById(id);
};

function update(id, new_info) {
  return db('shelves')
    .where({ id })
    .update(new_info)
    .then(() => {
      return findById(id);
    });
}

const remove = async (id) => {
  return await db('profile_book_connections').where({ id }).del();
};

module.exports = { findAll, findBy, findById, create, update, remove };
