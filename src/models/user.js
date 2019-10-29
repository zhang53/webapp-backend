const { db } = require('../connection/db');

const model = () => db.collection('users');

const createUser = (user) => model().insertOne(user);

const findUser = (filter) => model().findOne(filter);

const countUsers = (query) => model().find(query).count();

module.exports = {
  createUser,
  findUser,
  countUsers,
};
