#!/usr/bin/env node

var program = require('commander')
var fs = require('../lib/utils/fs-plus2')
var logger = require('../lib/utils/logger')

program
  .version(require('../package.json').version)
  .usage('[command] [options]')
  .description('another static glog generator by using ghost theme')
  .option('-c, --config <path>', 'set config path. default is ./config.yaml')
  .option('-p, --port', 'the port of local server')
  .action(function(cmd, config) {
    setCliConfig()
    console.log(1, global.configFile);
  })

program
  .command('generate')
  .alias('g')
  .description('generate blog')
  .action(function() {
    setCliConfig()
    generate()
  })

program.command('init')
  .alias('i')
  .description('initialize blog folders in current directory')
  .action(function() {
    setCliConfig()
    require('./sg-init')()
  })


program.command('clean')
  .alias('c')
  .description('clean temp dir')
  .action(function() {
    setCliConfig()
    clean()
  })

program.command('deploy')
  .alias('d')
  .description('deploy to server, use config.deploy in config.yaml as command')
  .action(function() {
    setCliConfig()
    deploy()
  })
program.command('generateAndDeploy')
  .alias('gd')
  .description('generate and deploy')
  .action(function() {
    setCliConfig()
    var pool = generate()
    pool.on('finish', deploy)
  })

program.command('server')
  .alias('s')
  .description('start a static server, which would auto generate when posts changed')
  .action(function() {
    setCliConfig()
    server()
  })
program.parse(process.argv);

function setCliConfig() {
  global.cliConfig = program
}

function generate(pool) {
  var config = require('../lib/config')
  var Temp = require('../lib/utils/temp')
  var logger = require('../lib/utils/logger')
  if (!fs.existsSync(config.paths.theme)) {
    logger.logErrorAndExit(new Error('Default theme is not found!!! [' + config.paths.theme + ']'))
  }

  return require('../lib/statical_ghost').generate(pool)
}

function clean() {
  require('../lib/utils/logger').info('clean temp dir...');
  require('../lib/utils/temp').clear()
}

function deploy() {
  logger.info('start deploying...')
  var exec = require('child_process').exec
  var config = require('../lib/config')
  if (!config.deploy) {
    logger.warn('no deploy commands found, plz check yout config file')
    return
  }
  exec(config.deploy, {
    maxBuffer: 200
  }, function(error, stdout, stderr) {
    error && console.error(error)
    console.log(stdout)
    console.error(stderr)
  })
}

function server() {
  var chokidar = require('chokidar');
  var config = require('../lib/config')
  var staticalGhost = require('../lib/statical_ghost')
  var static = require('node-static')
  var pool = require('../lib/thread').pool({
    autoKill: false
  })
  var isBusy = false
  pool.on('finish', function() {
      isBusy = false
      console.log('')
      logger.info('finish generating...')
    })
    // One-liner for current directory, ignores .dotfiles
  var last = new Date().getTime()
  var onFile = function(file, event) {
    var now = new Date().getTime()
    if (!isBusy && now - last > 3000) {
      isBusy = true
      if (file.indexOf(config.paths.themes) >= 0) {//主题改变则清楚缓存并重新复制
        // console.log('copy theme')
        clean()
        // fs.copy(config.paths.theme + '/assets', config.paths.public + '/assets')
      }else if (file.indexOf(config.paths.files) >= 0) {//文件改变则重新复制
        // fs.copy(config.paths.files, config.paths.public)
      }
      logger.info('start generating...')
      staticalGhost.generate(pool)
      last = new Date().getTime()
    }
  }
  chokidar.watch([config.paths.posts,
      config.paths.theme,
      config.configFile
    ])
    .on('add', onFile)
    .on('change', onFile)
    .on('unlink', onFile);

  var port = program.port || 8080
  var staticServer = new static.Server(config.paths.public, {
    cache: false,
    headers: {
      'Expires': '-1',
      'Cache-Control': 'no_cache',
      'Pragma': 'no-cache'
    }
  });

  require('http').createServer(function(request, response) {
    request.addListener('end', function() {
      staticServer.serve(request, response);
    }).resume();
  }).listen(port);
  logger.info('start server at: \n\n    http://127.0.0.1:' + port + '\n\n    press Ctrl+C to exit the server')
}

module.exports = program
