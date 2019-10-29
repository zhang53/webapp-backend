const jwt = require('express-jwt');

const authorize = (req, res, next) => jwt({ secret: req.app.get('secret') })(req, res, next);

module.exports = authorize;
