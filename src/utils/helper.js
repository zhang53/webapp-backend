const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/app');

const generatePasswordHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const validatePassword = (password, hash) => bcrypt.compareSync(password, hash);

const getAuthToken = (user) => jwt.sign({
  sub: user._id.toString(),
  email: user.email,
}, config.secret, { expiresIn: '2h' });

module.exports = {
  generatePasswordHash,
  validatePassword,
  getAuthToken,
};
