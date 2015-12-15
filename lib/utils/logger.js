/*jslint regexp: true */
var _ = require('lodash'),
  log4js = require('log4js')

log4js.configure({
  "appenders": [{
    "type": "console",
    "layout": {
      "type": "pattern",
      "pattern": "%[%r %p -%] %m%n",
      "tokens": {
        "pid": function() {
          return process.pid;
        }
      }
    }
  }]
})
logger = log4js.getLogger()

logger.throwError = function(err) {
  if (!err) {
    err = new Error('An error occurred');
  }

  if (_.isString(err)) {
    throw new Error(err);
  }

  throw err;
}


logger.logErrorAndExit = function(err) {
  this.error(err);
  process.exit(0);
}

logger.logAndThrowError = function(err) {
  this.error(err);
  this.throwError(err);
}

logger.logAndRejectError = function(err) {
  this.error(err);
  this.rejectError(err);
}


module.exports = logger;
