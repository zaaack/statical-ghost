var view = require('./view')
var ProgressBar = require('progress')
var colors = require('colors')
var poolSize = require('os').cpus().length
var Temp = require('./utils/temp')
var config = require('./config')
var fs = require('./utils/fs-plus2')
var Task =  require('./task')
var Init = require('./init')

module.exports = {
  getPool: function() {
    return this.pool
  },
  generate: function(pool) {
    var start = new Date().getTime()
    var self = this
    Init.init()
    var pool = this.pool = pool || require('../lib/thread').pool({
      size: poolSize,
      autoKill: true
    })
    var tasks = Task.getTasks()
    var barWidth = 20
    var bar = new ProgressBar(colors.green('generating... :) ') + colors.green(':bar') + '  ' + colors.yellow(':percent') + ' :elapseds ' + colors.red('threads: ' + poolSize + ' '), {
      complete: '■',
      incomplete: ' ',
      width: barWidth,
      total: tasks.length
    });

    var tasksEach = Math.ceil(tasks.length / poolSize)
    var progressStep = (tasks.length / barWidth) | 0
    var totalMemory = 0
    //mdadm
    var listeners = {
        progress: function(progress) {
          progress > 0 && bar.tick(progress)
        },
        memory: function(memory) {
          totalMemory += memory
        }
      }
    for (var i = 0; i < poolSize; i++) {
      var tasksForThread = tasks.slice(i * tasksEach, Math.min((i + 1) * tasksEach, tasks.length))
      var worker = pool.run(function(args, emit) {
        var view = require(args.requires.view)()
        var fs = require(args.requires.fsPlus2)
        var tasks = args.tasks
        var progressStep = args.progressStep
        tasks.forEach(function(task, index) {
          if (task.rss) {
            fs.writeFile(task.path, task.rss, 'utf-8',
              function(err) {
                err && console.error(err)
              })
          } else {
            view.render(task.tpl, task.context, task.context.relativeUrl)
          }
          if ((index !== 0) && ((index + 1) % progressStep === 0)) {
            emit('progress', progressStep)
          }
        })
        emit('progress', progressStep
          ? tasks.length % progressStep
          : tasks.length)
        emit('memory', process.memoryUsage().heapUsed)
      }, {
        tasks: tasksForThread,
        progressStep: progressStep,
        requires: {
          view: __dirname + '/view',
          fsPlus2: __dirname + '/utils/fs-plus2'
        }
      }, listeners)
    }

    pool.on('finish', function onFinish() {
      var time = (new Date().getTime() - start) / 1000
      time = time.toFixed(1)
      totalMemory = (totalMemory / 1024 / 1024).toFixed(1)
      console.info('total time: %ss   total memory: %sMB', time, totalMemory)
      Temp.updateBuildInfo({
        lastPostTime: new Date().getTime()
      })
      pool.removeListener('finish', onFinish) //remove listener, avoid listener leak
    })

    return pool
  }
}
