var Worker = require('./worker')
var Pool = require('./pool')

module.exports = {
  run: function(fn, args, options) {
    if (typeof fn !== 'function') {
      throw new Error('first parameter is not a Function!!!')
    }
    var worker = new Worker(options)
    worker.startTask(fn, args)
    return worker
  },
  pool: function(options) {
    return new Pool(options)
  }
}
