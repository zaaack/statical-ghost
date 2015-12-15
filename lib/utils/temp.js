var config = require('../config')
var fs = require('../utils/fs-plus2')
var consts = require('./consts')
var _ = require('lodash')

var tmpdir = config.paths.tmp
var expire = 3600 * 1000
var __DATA__ = {}

function createTemp(createData, prefix) {
  prefix = prefix || ''
  if (typeof createData === 'string') {
    prefix = createData
    createData = null
  }
  return {
    isExpired: function(tempData, lastModifyTime) {
      return false
    },
    expiredBy: function(isExpired) {
      this.isExpired = isExpired
      return this
    },
    get: function(name, defaults) {
      var tempFile = tmpdir + '/' + prefix + name
      var data = null,
        tempContent, lastModifyTime;
      if (name in __DATA__) {
        var tmpData = __DATA__[name]
        data = tmpData.data
        lastModifyTime = tmpData.lastModifyTime
      } else if (fs.existsSync(tempFile)) {
        tempContent = fs.readFileSync(tempFile, 'utf-8')
        var tmpData
        try {
          tmpData = JSON.parse(tempContent)
          __DATA__[name] = tmpData
          data = tmpData.data
          lastModifyTime = tmpData.lastModifyTime
        } catch (e) {}
      }

      if (!data || this.isExpired(name, data, lastModifyTime)) { //exists temp and it's not expired
        data = createData && createData(name) || null
        this.set(name, data)
      }
      return data || defaults
    },
    set: function(name, value) {
      var tempFile = tmpdir + '/' + prefix + name
      if (value === null || value === undefined) {
        fs.removeSync(tempFile)
      } else {
        var tempData = {
          data: value,
          lastModifyTime: new Date().getTime()
        }
        var tempContent = JSON.stringify(tempData)
        fs.writeFile(tempFile, tempContent, 'utf-8')
        __DATA__[name] = tempData
      }
      return value
    }
  }
}

var tempInstance = createTemp()
module.exports = {
  TIME_EXPIRE: function(data, lastModifyTime) {
    if (lastModifyTime + expire < new Date().getTime()) {
      return true
    }
    return false
  },
  create: createTemp,
  temp: tempInstance,
  getBuildInfo: function(name, defaults) {
    var buildInfo = this.get('buildInfo') || {}
    defaults = defaults === undefined ? null : defaults
    return buildInfo[name] || defaults
  },
  updateBuildInfo: function(props) {
    var buildInfo = this.get('buildInfo') || {}
    return this.set('buildInfo', _.merge(buildInfo, props))
  },
  clear: function() {
    __DATA__ = {}
    fs.removeSync(config.paths.tmp)
  }
}
_.assign(module.exports, tempInstance)
