const shelves = [
  {
    profileId: 1,
    name: 'Book Club',
  },
  { profileId: 1, name: 'Owned' },
  { profileId: 2, name: 'Wish List' },
  { profileId: 2, name: 'Favorite Authors' },
  { profileId: 3, name: 'Books to Buy' },
  { profileId: 3, name: 'Recommended' },
  { profileId: 4, name: 'Vampires' },
  { profileId: 4, name: 'Favorite Series' },
  { profileId: 5, name: 'Cookbooks' },
  { profileId: 5, name: 'Boring' },
];

exports.seed = function (knex) {
  return knex('shelves').insert(shelves);
};
