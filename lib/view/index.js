var hbs = require('handlebars')
var config = require('../config')
var coreHelpers = require('./helpers')
var fs = require('../utils/fs-plus2')
var path = require('path')
var Temp = require('../utils/temp')
var logger = require('../utils/logger')

function registerPartial(partialDir) {
  fs.readdirSync(partialDir).forEach(function(name) {
    var file = partialDir + '/' + name
    var partialName = path.basename(name, '.hbs')
    hbs.registerPartial(partialName, fs.readFileSync(file, 'utf-8'))
  })
}

registerPartial(__dirname + '/helpers/tpl')
registerPartial(config.paths.theme + '/partials')

coreHelpers.loadCoreHelpers(hbs)

function getRawTpl(name) {
  var tplFile = config.paths.theme + '/' + name + '.hbs'
  return hbs.precompile(fs.readFileSync(tplFile, 'utf-8'))
}

var isThemeChanged = Temp.getBuildInfo('theme') !== config.theme
        || fs.statSync(config.paths.theme).mtime.getTime() > config.getBuildInfo('lastPostTime')
var templateTemp = Temp.create(getRawTpl, 'tpl_').expiredBy(function(name, tempData, tempTime) {
  return isThemeChanged
})

// var tplFile = config.paths.theme + '/'+name+'.hbs'
// return hbs.compile(fs.readFileSync(tplFile, 'utf-8'))

var __RENDERS__ = {};
// trigger writing temp file, avoid multi process writing
['post', 'author', 'index', 'page', 'tag', 'page'].forEach(function(tplName) {
  templateTemp.get(tplName)
})

var tpl = hbs.template(eval('(' + templateTemp.get('default') + ')'))
module.exports = {
  compile: function(tplName) {
    if (!(tplName in __RENDERS__)) {
      var bodyTpl = hbs.template(eval('(' + templateTemp.get(tplName) + ')'))
      __RENDERS__[tplName] = function(context, dest) {
        var customTplName = tplName +'-'+ context.post.slug
        if((tplName === 'post' || tplName === 'page')
            && fs.existsSync(config.paths.theme + '/' + customTplName + '.hbs')){
          bodyTpl = hbs.template(eval('(' + templateTemp.get(customTplName) + ')'))
        }
        context.body = bodyTpl(context, {
          data: {
            blog: config.blog
          }
        })
        var html = tpl(context, {
          data: {
            blog: config.blog
          }
        })
        fs.writeFile(config.paths.public + dest + 'index.html', html, 'utf-8',
          function(err) {
            err && console.error(err)
          })
      }
    }
    return __RENDERS__[tplName]
  }
}
