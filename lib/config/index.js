var _ = require('lodash')
var yaml = require('js-yaml')
var fs = require('../utils/fs-plus2')
var urlConfig = require('./url')
var config = require('./defaults')
var program = require('commander')
var logger = require('../utils/logger')

var configFile = global.cliConfig && global.cliConfig.config || process.cwd() + '/config.yaml',
  configFromFile = null;

function loadConfig(){
  if (fs.existsSync(configFile)) {
    configFromFile = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
    config = _.merge(config, configFromFile)
  } else {
    logger.logErrorAndExit(new Error('No config.yaml found!!! Plz run `sg i` first!'))
  }

  var baseDir = process.cwd();
  // var baseDir = 'E:/versioncontrol/doubangit/code/mine/node/github-blog';

  ['posts', 'public', 'tmp', 'themes'].forEach(function(name) {
    config.paths[name] = baseDir + config.paths[name]
  })
  config.paths.theme = config.paths.themes + '/' + config.theme

}

loadConfig()

urlConfig.setConfig(config)
config = _.merge(config, urlConfig, {
  configFile: configFile,
  loadConfig: loadConfig,
  getConfigFromFile: function() {
    return configFromFile || {}
  },
  writeConfigToFile: function(props) {
    config = _.merge(config, props)
    configFromFile = _.merge(configFromFile, props)
    var configContent = yaml.safeDump(configFromFile)
    fs.writeFile(configFile, configContent)
  }
})

module.exports = config
