const logger = require('../utils/logger');
const NotifyResult = require('../results/notify');

const NODE_ENV = process.env.NODE_ENV || 'development';

const sendHttpError = (err, res) => {
  res.status(err.status || 500);

  if (err instanceof Error) {
    if (NODE_ENV === 'development') {
      logger.error(err.stack);
    }

    res.json(new NotifyResult(err.message));
  } else {
    res.json(new NotifyResult('Unknown Error'));
  }
};

module.exports = sendHttpError;
