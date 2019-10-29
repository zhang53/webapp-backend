const { Db } = require('../src/connection/db');
const config = require('../src/config/app');

let db;

before(async () => {
  db = Db(config.db.uri, config.db.name, config.db.options);
  await db.initialize(null, config.db.reconnectDelay);
});

require('./auth.test');

after((done) => {
  db.dropDatabase().then(() => {
    db.close(true);
    done();
  });
});
