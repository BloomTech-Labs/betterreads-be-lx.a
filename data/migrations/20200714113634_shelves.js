exports.up = function (knex) {
  return knex.schema.createTable('shelves', function (table) {
    table.increments('id').notNullable().unique().primary();
    table.string('name').notNullable();
    table
      .integer('profileId')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('profiles')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('shelves');
};
