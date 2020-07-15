const readingOptions = [
  { status: 'to read' },
  { status: 'reading' },
  { status: 'finished' },
];

exports.seed = function (knex) {
  return knex('reading_options').insert(readingOptions);
};
