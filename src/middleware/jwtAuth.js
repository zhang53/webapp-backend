const jwt = require('express-jwt');
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

const authorize = jwt({
  secret: config.secret,
  isRevoked: blacklist.isRevoked,
});

const revoke = (req, res, next) => {
  blacklist.revoke(req.user);
  next();
};

module.exports = {
  authorize,
  revoke,
};
