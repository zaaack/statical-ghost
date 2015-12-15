var postsGenerator = require('./posts_generator')
var authorGenerator = require('./author_generator')
var indexGenerator = require('./index_generator')
var tagGenerator = require('./tag_generator')
var view = require('../view')
var ProgressBar = require('progress')
var colors = require('colors')
var poolSize = require('os').cpus().length
var Temp = require('../utils/temp')
var config = require('../config')
var fs = require('../utils/fs-plus2')

function cleanIfConfigChanged() {
  var stat = fs.statSync(config.configFile)
  var lastPostTime = Temp.getBuildInfo('lastPostTime')
  if (lastPostTime && lastPostTime < stat.mtime.getTime()) {
    var path = require('path')
    logger.info((path.basename(config.configFile) + ' is modified, regenerate all'))
    Temp.clear()
    fs.removeSync(config.paths.public)
    config.loadConfig()
  }
}

function isAssetsChanged(src, dst) {
  return Temp.getBuildInfo('theme') !== config.theme || !fs.existsSync(dst) || fs.statSync(src).mtime.getTime() > Temp.getBuildInfo('lastPostTime')
}

function copyAssets() {
  var assetsSrc = config.paths.theme + '/assets'
  var assetsDst = config.paths.public + '/assets'
  isAssetsChanged(assetsSrc, assetsDst) && fs.copy(assetsSrc, assetsDst)

  var copyFile = [{
    src: config.paths.theme + '/favicon.ico',
    dst: config.paths.public + '/favicon.ico'
  }, {
    src: __dirname + '/../../assets/jquery.min.js',
    dst: config.paths.public + '/public/jquery.min.js'
  }, {
    src: config.paths.files,
    dst: config.paths.public
  }]
  copyFile.forEach(function(copy) {
    if (isAssetsChanged(copy.src, copy.dst)) {
      fs.copy(copy.src, copy.dst)
    }
  })
}


module.exports = {
  getPool: function() {
    return this.pool
  },
  getTasks: function() {
    return postsGenerator.getTasks()
      .concat(authorGenerator.getTasks())
      .concat(indexGenerator.getTasks())
      .concat(tagGenerator.getTasks())
  },
  init: function() {
    cleanIfConfigChanged()
    copyAssets()
    var baseModel = require('../model/base_model').init()

  },
  generate: function(pool) {
    var start = new Date().getTime()
    var self = this
    this.init()
    var pool = this.pool = pool || require('../thread').pool({
      size: poolSize,
      autoKill: true
    })
    var tasks = this.getTasks()
    var barWidth = 20
    var bar = new ProgressBar(colors.green('working very hard :) ') + colors.green(':bar') + '  ' + colors.yellow(':percent') + ' :elapseds ' + colors.red('threads: ' + poolSize + ' '), {
      complete: '■',
      incomplete: ' ',
      width: barWidth,
      total: tasks.length
    });

    var tasksEach = Math.ceil(tasks.length / poolSize)
    var progressStep = (tasks.length / barWidth) | 0
    var totalMemory = 0
    var listeners = {
        progress: function(progress) {
          progress > 0 && bar.tick(progress)
        },
        memory: function(memory) {
          totalMemory += memory
        }
      }
      // view.precompile()
    for (var i = 0; i < poolSize; i++) {
      var tasksForThread = tasks.slice(i * tasksEach, Math.min((i + 1) * tasksEach, tasks.length))
      var worker = pool.run(function(args, emit) {
        var view = require(args.requires.view)
        var fs = require(args.requires.fsPlus2)
        var tasks = args.tasks
        var progressStep = args.progressStep
        var render
        tasks.forEach(function(task, index) {
          if (task.rss) {
            fs.writeFile(task.path, task.rss, 'utf-8',
              function(err) {
                err && console.error(err)
              })
          } else {
            render = view.compile(task.tpl)
            render(task.context, task.context.relativeUrl)
          }
          if ((index !== 0) && ((index + 1) % progressStep === 0)) {
            emit('progress', progressStep)
          }
        })
        emit('progress', tasks.length % progressStep)
        emit('memory', process.memoryUsage().heapUsed)
      }, {
        tasks: tasksForThread,
        progressStep: progressStep,
        requires: {
          view: __dirname + '/../view',
          fsPlus2: __dirname + '/../utils/fs-plus2'
        }
      }, listeners)
    }

    pool.on('finish', function onFinish() {
      var time = (new Date().getTime() - start) / 1000
      time = time.toFixed(1)
      totalMemory = (totalMemory / 1024 / 1024).toFixed(1)
      console.info('total time: %ss   total memory: %sMB', time, totalMemory)
      Temp.updateBuildInfo({
        lastPostTime: new Date().getTime(),
        theme: config.theme
      })
      pool.removeListener('finish', onFinish)
    })

    return pool
  }

}
