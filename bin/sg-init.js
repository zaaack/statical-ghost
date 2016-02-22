var fs = require('../lib/utils/fs-plus2')
var logger = require('../lib/utils/logger')
var yaml = require('js-yaml')

var config

function initConfig() {
  var baseDir = process.cwd()
  var configFile = global.cliConfig.config || './config.yaml'
  if (!fs.existsSync(configFile)) {
    var content = fs.readFileSync(__dirname + '/config.yaml', 'utf-8');
    fs.writeFileSync(configFile, content, 'utf-8')
  }
  config = require('../lib/config')
}

function initFolders() {
  var dirs = ['public', 'posts', 'themes', 'tmp']
  var copyFile = 'how-to-use-fascinating-static-blog-generator-statical-ghost.md'
  dirs.forEach(function(dir) {
    fs.makeTreeSync(config.paths[dir])
  })
  fs.copySync(__dirname + '/' + copyFile, config.paths.posts + '/' + copyFile)
}

function downloadDefaultTheme() {
  var child = require('child_process')
  var url = config.themeUrl || 'https://github.com/TryGhost/Casper.git'
  var git = child.spawn('git', ['clone', '--depth', '1', url], {
      cwd: config.paths['themes']
    },
    function(error) {
      logger.error(error)
    })
  logger.info('Start clone ghost theme ' + config.theme + ': ' + url + '...')
  git.stdout.pipe(process.stdout)
  git.stderr.pipe(process.stderr)
}

module.exports = function main() {
  initConfig()
  initFolders()
  downloadDefaultTheme()
}
