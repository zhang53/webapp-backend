require('dotenv').config();
require('datejs');
const { name } = require('../../package.json');

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  environment: NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    accessExp: Number(process.env.JWT_ACCESS_EXP || 3600), // Default to 1 hour
    refreshExp: Number(process.env.JWT_REFRESH_EXP || 604800), // Default to 1 week
  },
  db: {
    uri: process.env.DB_URI || 'mongodb://127.0.0.1:27017',
    name: process.env.DB_NAME || 'webapp',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
  },
  blacklist: {
    type: process.env.BLACKLIST_TYPE || 'redis',
    keyPrefix: `${name}:`,
    host() {
      return config[this.type].host;
    },
    port() {
      return config[this.type].port;
    },
  },
};

if (NODE_ENV === 'test') {
  Object.assign(config.db, {
    uri: process.env.DB_TEST_URI || 'mongodb://127.0.0.1:27017',
    name: process.env.DB_TEST_NAME || 'webapp_test',
  });
}

module.exports = config;
