var fork = require('child_process').fork
var EventEmitter = require('events');
var util = require('util')
var _ = require('lodash')

function Worker(options) {
  EventEmitter.call(this);

  this.options = options = options || {}
  var self = this
  this.child = fork(__dirname + '/slave.js', options.childOptions)
  this.child.on('message', function(data) {
    self.emit(data.event, data.data)
  })
  this.state = self.STATE_IDLE
  this.on('finish', function(ret) {
    self.state = self.STATE_IDLE
    Object.keys(self.listeners).forEach(function(event) {
      self.removeListener(event, self.listeners[event])
    })
    self.listeners = {}
  })
}
util.inherits(Worker, EventEmitter);

_.assign(Worker.prototype, {
  STATE_IDLE: 'idle',
  STATE_BUSY: 'busy',
  isIdle: function() {
    return this.state === this.STATE_IDLE
  },
  isBusy: function() {
    return this.state === this.STATE_BUSY
  },
  startTask: function(fn, args, listeners) {
    var self = this
    self.listeners = listeners || {}
    Object.keys(self.listeners).forEach(function(event) {
      self.on(event, self.listeners[event])
    })
    this.emitToChild('startTask', {
      fn: fn.toString(),
      args: args,
      autoKill: self.options.autoKill
    })
    this.state = this.STATE_BUSY
    return this
  },
  kill: function() {
    this.child.kill()
  },
  emitToChild: function(event, data) {
    this.child.send({
      event: event,
      data: data
    })
  }
})

module.exports = Worker
