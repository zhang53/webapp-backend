require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  environment: NODE_ENV,
  secret: process.env.JWT_SECRET || 'secret',
  db: {
    uri: process.env.DB_URI || 'mongodb://127.0.0.1:27017',
    name: process.env.DB_NAME || 'webapp',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    reconnectDelay: 10000,
  },
};

if (NODE_ENV === 'test') {
  Object.assign(config.db, {
    uri: process.env.DB_TEST_URI || 'mongodb://127.0.0.1:27017',
    name: process.env.DB_TEST_NAME || 'webapp_test',
  });
}

module.exports = config;
