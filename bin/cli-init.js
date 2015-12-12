var fsPlus = require('fs-plus')
var fs = require('fs')
var logger = require('../lib/utils/logger')
var yaml = require('js-yaml')

var config

function initConfig(){
  var baseDir = process.cwd()
  var configFile = global.cliConfig.config || './config.yaml'
  if (!fs.existsSync(configFile)) {
    fsPlus.createReadStream(__dirname+'/config.yaml').pipe(fsPlus.createWriteStream(configFile))
  }
  config = require('../lib/config')
}

function initFolders(){
  var dirs = ['public', 'posts', 'themes', 'tmp']
  dirs.forEach(function(dir) {
    fsPlus.makeTree(config.paths[dir])
  })
}

function downloadDefaultTheme() {
  var child = require('child_process')
  var url = 'https://github.com/TryGhost/Casper.git'
  var git = child.spawn('git',['clone','--depth','1',url],
    { cwd: config.paths['themes'] },
    function (error) {
      logger.error(error)
    })
  logger.info('start clone default ghost theme Casper: '+url+'...')
  git.stdout.pipe(process.stdout)
  git.stderr.pipe(process.stderr)
}


(function main(){
  initConfig()
  initFolders()
  downloadDefaultTheme()
})()
