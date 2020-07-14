exports.up = function (knex) {
  return knex.schema.createTable('shelf_book_connections', function (table) {
    table.increments('id').notNullable().unsigned().unique().primary();
    table
      .integer('ShelfId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('shelves')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .integer('ConnectionId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('profile_book_connections')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('shelf_book_connections');
};
