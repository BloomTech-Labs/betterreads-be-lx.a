const connections = [
  {
    ShelfId: 1,
    ConnectionId: 1,
  },
  {
    ShelfId: 2,
    ConnectionId: 2,
  },
  {
    ShelfId: 3,
    ConnectionId: 3,
  },
  {
    ShelfId: 4,
    ConnectionId: 4,
  },
];

exports.seed = function (knex) {
  return knex('shelf_book_connections').insert(connections);
};
