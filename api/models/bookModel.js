const db = require('../../data/db-config');

const findAll = async () => {
  return await db('books');
};

const findBy = (filter) => {
  return db('books').where(filter);
};

const findById = async (id) => {
  return db('books').where({ id }).first().select('*');
};

const create = async (book) => {
  const [id] = await db('books').insert(book).returning('id');
  return findById(id);
};

const remove = async (id) => {
  return await db('books').where({ id }).del();
};

module.exports = { findAll, findBy, findById, create, remove };
