const JsonResult = require('./JsonResult');

class NotifyResult extends JsonResult {
  constructor(message, data) {
    super(data);

    this.message = message;
  }
}

module.exports = NotifyResult;
