var fork = require('child_process').fork
var Worker = require('./worker')
var EventEmitter = require('events')
var util = require('util')
var _ = require('lodash')

function Pool(options) {
  if (typeof options === 'number') {
    options = {
      size: options
    }
  }
  options = options || {}
  options.size = options.size || require('os').cpus().length
  this.options = options
  var self = this
  EventEmitter.call(this);
  this.workers = []
  for (var i = 0; i < options.size; i++) {
    var worker = new Worker(options.workerOptions)
    worker.on('finish', function(ret) {
      self.emit('hasIdleWorker', this)
    })
    this.workers.push(worker)
  }
  this.queue = []

  this.idleWorkerCount = options.size
  this.on('hasIdleWorker', function(worker) {
    if (this.queue.length > 0) {
      worker.startTask.apply(worker, this.queue.shift())
    } else {
      self.idleWorkerCount++
        if (self.idleWorkerCount === self.workers.length) {
          options.autoKill && self.killAll()
          self.emit('finish', self)
        }
    }
  })
}
util.inherits(Pool, EventEmitter);

_.assign(Pool.prototype, {
  run: function(fn, args, listeners) {
    var self = this
    var hasIdleWorker = this.workers.some(function(worker) {
      if (worker.isIdle()) {
        worker.startTask(fn, args, listeners)
        self.idleWorkerCount--
        return true
      } else {
        return false
      }
    })
    if (!hasIdleWorker) {
      this.queue.push(arguments)
    }
  },
  killAll: function() {
    this.workers.forEach(function(worker) {
      worker.kill()
    })
  }
})

module.exports = Pool
