const { MongoClient } = require('mongodb');
const logger = require('../utils/logger');

class Db {
  connect(uri, options) {
    this._client = new MongoClient(uri, options);
    return this._client.connect();
  }

  switchDatabase(dbName) {
    this._db = this._client.db(dbName);
    logger.info(`Switched to database [${dbName}]`);
  }

  collection(name) {
    return this._db.collection(name);
  }

  dropDatabase() {
    return this._db.dropDatabase();
  }

  close(force) {
    return this._client.close(force);
  }

  async initialize(uri, dbName, options) {
    try {
      await this.connect(uri, options);
      logger.info('Connected successfully to MongoDB');
      this.switchDatabase(dbName);
      return true;
    } catch (err) {
      this.close(true);
      logger.error(err);
      return false;
    }
  }
}

module.exports = new Db();
