exports.up = function (knex) {
  return knex.schema.createTable('books', function (table) {
    table.integer('id').notNullable().unique().primary();
    table.string('googleId').notNullable().unique();
    table.string('title').notNullable();
    table.string('authors').notNullable();
    table.string('publisher');
    table.string('publishedDate');
    table.string('description');
    table.string('isbn10');
    table.string('isbn13');
    table.integer('pageCount');
    table.string('categories');
    table.string('thumbnail');
    table.string('smallThumbnail');
    table.string('language');
    table.string('webReaderLink');
    table.string('textSnippet');
    table.string('buyLink');
    table.boolean('publicDomain');
    table.decimal('averageRange');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('books');
};
