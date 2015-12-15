var fs = require('../lib/utils/fs-plus2')
var logger = require('../lib/utils/logger')
var yaml = require('js-yaml')

var config

function initConfig(){
  var baseDir = process.cwd()
  var configFile = global.cliConfig.config || './config.yaml'
  if (!fs.existsSync(configFile)) {
    var content = fs.readFileSync(__dirname+'/config.yaml', 'utf-8');
    fs.writeFileSync(configFile, content, 'utf-8')
  }
  config = require('../lib/config')
}

function initFolders(){
  var dirs = ['public', 'posts', 'themes', 'tmp']
  dirs.forEach(function(dir) {
    fs.makeTree(config.paths[dir])
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
  logger.info('Start clone default ghost theme Casper: '+url+'...')
  git.stdout.pipe(process.stdout)
  git.stderr.pipe(process.stderr)
}

module.exports = function main(){
  initConfig()
  initFolders()
  downloadDefaultTheme()
}
