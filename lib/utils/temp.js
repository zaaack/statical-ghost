var config = require('../config')
var fs = require('../utils/fs-plus2')
var consts = require('./consts')
var _ = require('lodash')
var logger = require('./logger')
  // it's not reliable in multi process calling
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
    createData: createData,
    prefix: prefix,
    isExpired: function(tempData, lastModifyTime) {
      return false
    },
    expiredBy: function(isExpired) {
      this.isExpired = isExpired
      return this
    },
    get: function(name, defaults) {
      var fullName = prefix + name
      var tempFile = tmpdir + '/' + fullName
      var data = '',
        tempContent, lastModifyTime;
      if (fullName in __DATA__) {
        var tmpData = __DATA__[fullName]
        data = tmpData.data
        lastModifyTime = tmpData.lastModifyTime
      } else if (fs.existsSync(tempFile)) {
        tempContent = fs.readFileSync(tempFile, 'utf-8')
        var tmpData
        try {
          tmpData = JSON.parse(tempContent)
          __DATA__[fullName] = tmpData
          data = tmpData.data
          lastModifyTime = tmpData.lastModifyTime
        } catch (e) {
          logger.error(e)
        }
      }

      if (!data || this.isExpired(name, data, lastModifyTime)) { //exists temp and it's expired
        try{
          data = this.createData && this.createData(name)
        }catch(e){
          logger.warn(e)
        }
        this.set(name, data)
      }
      return data || defaults || null
    },
    set: function(name, value) {
      var fullName = prefix + name
      var tempFile = tmpdir + '/' + fullName
      if (value === null) {
        fs.removeSync(tempFile)
        delete __DATA__[fullName]
      } else {
        var tempData = {
          data: value,
          lastModifyTime: new Date().getTime()
        }
        var tempContent = JSON.stringify(tempData)
        fs.writeFileSync(tempFile, tempContent, 'utf-8')
        __DATA__[fullName] = tempData
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
