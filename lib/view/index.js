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

function getRawTpl(name, prefix) {
  prefix = prefix || ''
  var tplFile = config.paths.theme + '/' + name + '.hbs'
  return hbs.precompile(fs.readFileSync(tplFile, 'utf-8'))
}

var templateTemp = Temp.create(getRawTpl, 'tpl_').expiredBy(function(name, tempData, tempTime) {
  return fs.statSync(config.paths.theme+'/'+name+'.hbs').mtime.getTime()>tempTime
})

// var tplFile = config.paths.theme + '/'+name+'.hbs'
// return hbs.compile(fs.readFileSync(tplFile, 'utf-8'))

var __RENDERS__ = {};

// trigger writing temp file, avoid multi process writing

var tpl = hbs.template(eval('(' + templateTemp.get('default') + ')'))
module.exports = {
  buildTemp: function() {
    ['post', 'author', 'index', 'page', 'tag', 'default'].forEach(function(tplName) {
      templateTemp.get(tplName)
    })
  },
  compile: function(tplName) {
    bodyTpl = hbs.template(eval('(' + templateTemp.get(tplName) + ')'))
    return function(context, dest) {
      if (tplName === 'post' || tplName === 'page') {
        var customTplName = tplName + '-' + context.post.slug
        if (fs.existsSync(config.paths.theme + '/' + customTplName + '.hbs')) {
          bodyTpl = hbs.template(eval('(' + templateTemp.get(customTplName) + ')'))
        }
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
      //if it's async, it would miss files because of over max open files limit
      fs.writeFileSync(config.paths.public + dest + 'index.html', html, 'utf-8')
    }
  }
}
