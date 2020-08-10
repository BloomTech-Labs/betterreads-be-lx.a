const db = require('../../data/db-config');

const findAll = async () => {
  return await db('shelf_book_connections');
};

const findBy = (filter) => {
  return db('shelf_book_connections').where(filter);
};

const duplicateCheck = (ShelfId, ConnectionId) => {
  return db('shelf_book_connections').where({
    ShelfId: ShelfId,
    ConnectionId: ConnectionId,
  });
};

const findByShelfId = (ShelfId) => {
  return db('shelf_book_connections').where({ ShelfId: ShelfId });
};

const findById = async (id) => {
  return db('shelf_book_connections').where({ id }).first().select('*');
};

const create = async (connection) => {
  const [id] = await db('shelf_book_connections')
    .insert(connection)
    .returning('id');
  return findById(id);
};

const remove = async (id) => {
  return await db('shelf_book_connections').where({ id }).del();
};

module.exports = {
  findAll,
  findBy,
  findByShelfId,
  findById,
  duplicateCheck,
  create,
  remove,
};
