const db = require('../../data/db-config');

const findAll = async () => {
  return await db('profile_book_connections');
};

const findBy = (filter) => {
  return db('profile_book_connections').where(filter);
};

const findById = async (id) => {
  return db('profile_book_connections').where({ id }).first().select('*');
};

const create = async (connection) => {
  const [id] = await db('profile_book_connections')
    .insert(connection)
    .returning('id');
  return findById(id);
};

function update(id, new_info) {
  return db('profile_book_connections')
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
