exports.up = (knex) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('profiles', function (table) {
      table.increments('id').notNullable().unique().primary();
      table.string('oktaUserId').notNullable();
      table.string('email');
      table.string('name');
      table.string('avatarUrl');
      table.timestamps(true, true);
    });
};
exports.down = (knex) => {
  return knex.schema.dropTableIfExists('profiles');
};
