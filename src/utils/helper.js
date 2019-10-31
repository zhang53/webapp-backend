const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generatePasswordHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const validatePassword = (password, hash) => bcrypt.compareSync(password, hash);

const getAuthToken = (user, secret) => jwt.sign({
  id: user._id.toString(),
  email: user.email,
}, secret, { expiresIn: '2h' });

module.exports = {
  generatePasswordHash,
  validatePassword,
  getAuthToken,
};
