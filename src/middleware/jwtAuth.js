const jwt = require('jsonwebtoken');
const auth = require('express-jwt');
const blacklist = require('express-jwt-blacklist');
const config = require('../config/app');

if (config.environment === 'production') {
  blacklist.configure({
    store: {
      type: config.blacklist.type,
      host: config.blacklist.host(),
      port: config.blacklist.port(),
      keyPrefix: config.blacklist.keyPrefix,
    },
  });
}

const authorize = auth({
  secret: config.secret,
  isRevoked: blacklist.isRevoked,
});

const revokeToken = ({ user }, res, next) => {
  blacklist.revoke(user);
  next();
};

const getToken = ({ user, result }, res) => {
  const token = jwt.sign({
    sub: user._id.toString(),
    email: user.email,
    permissions: user.permissions,
  }, config.secret, { expiresIn: '2h' });

  res.header('Authorization', token);
  res.json(result);
};

module.exports = {
  authorize,
  revokeToken,
  getToken,
};
