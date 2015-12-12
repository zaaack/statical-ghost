var _ = require('lodash')
var yaml = require('js-yaml')
var fs = require('fs')
var urlConfig = require('./url')
var config = require('./defaults')
var program = require('commander')

var configFile = global.cliConfig.config || process.cwd() + '/config.yaml',
  configFromFile = null


if (fs.existsSync(configFile)) {
  configFromFile = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
  config = _.merge(config, configFromFile)
}

var baseDir = process.cwd();
// var baseDir = 'E:/versioncontrol/doubangit/code/mine/node/github-blog';

['posts', 'public', 'tmp', 'themes'].forEach(function (name) {
  config.paths[name]  = baseDir + config.paths[name]
})
config.paths.theme = config.paths.themes + '/' + config.theme

urlConfig.setConfig(config)
config = _.merge(config, urlConfig)

module.exports = config
