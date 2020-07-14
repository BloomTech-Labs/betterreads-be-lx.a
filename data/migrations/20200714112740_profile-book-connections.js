
exports.up = function(knex) {
    return knex.schema.createTable('profile_book_connections', function(table){
        table.increments("id").notNullable().unique().primary()
        table.integer("profileId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("profiles")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
        table.integer("bookId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("books")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
        table.integer("readingStatus")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("reading_options")
            .onDelete("CASCADE")
            .onUpdate("CASCADE")
        table.dateTime("dateStarted")
        table.dateTime("dateFinished")
        table.dateTime("dateAdded")
        table.boolean("favorite")
        table.decimal("personalRating")

    })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("profile_book_connections")
};
