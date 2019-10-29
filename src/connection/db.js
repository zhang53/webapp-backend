const mongodb = require('mongodb');
const delay = require('delay');
const logger = require('../utils/logger');

const { MongoClient } = mongodb;

class Db {
  constructor() {
    this._mongoClient = null;
    this._db = null;
    this._dbName = null;
  }

  configure(uri, dbName, options) {
    this._mongoClient = new MongoClient(uri, options || { useNewUrlParser: true });
    this._dbName = dbName;
  }

  collection(collectionName) {
    return this._db.collection(collectionName);
  }

  async connect() {
    await this._mongoClient.connect();
    this._db = this._mongoClient.db(this._dbName);
  }

  dropDatabase() {
    return this._db.dropDatabase();
  }

  close(force) {
    this._mongoClient.close(force);
  }

  async initialize(cb, reconnectDelay = 5000) {
    try {
      await this.connect();
      logger.info('Connected successfully to MongoDB');
      return cb;
    } catch (err) {
      logger.warn(`Unable to connect to MongoDB, retrying in ${reconnectDelay / 1000} seconds...`);
      logger.error(err);
      this.close(true);
      await delay(reconnectDelay);
      return this.initialize(cb, reconnectDelay);
    }
  }
}

const instance = new Db();

module.exports.Db = (uri, dbName, options) => {
  instance.configure(uri, dbName, options);
  return instance;
};

module.exports.db = instance;
