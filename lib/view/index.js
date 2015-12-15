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
var templateTemp = Temp.create(getRawTpl, 'tpl_').expiredBy(function(name, tempData, tempTime) {
  var tplTime = fs.statSync(config.paths.theme + '/' + name + '.hbs').mtime.getTime()
  return isThemeChanged || tplTime > tempTime
})

// var tplFile = config.paths.theme + '/'+name+'.hbs'
// return hbs.compile(fs.readFileSync(tplFile, 'utf-8'))

var __RENDERS__ = {};
['post', 'author', 'index', 'page', 'tag'].forEach(function(templateName) {
  templateTemp.get(templateName)
})

var tpl = hbs.template(eval('(' + templateTemp.get('default') + ')'))
module.exports = {
  compile: function(templateName) {
    if (!(templateName in __RENDERS__)) {
      var bodyTpl = hbs.template(eval('(' + templateTemp.get(templateName) + ')'))
      __RENDERS__[templateName] = function(context, dest) {
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
    return __RENDERS__[templateName]
  }
}
