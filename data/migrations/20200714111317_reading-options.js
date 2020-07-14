exports.up = function (knex) {
  return knex.schema.createTable('reading_options', function (table) {
    table.increments('id').notNullable().unique().primary();
    table.integer('status').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('reading_options');
};
