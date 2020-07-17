const faker = require('faker');

const profiles = [...new Array(20)].map(() => ({
  oktaUserId: faker.random.alphaNumeric(20),
  avatarUrl: faker.image.avatar(),
  email: faker.internet.email(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
}));

exports.seed = function (knex) {
  return knex('profiles').insert(profiles);
};
