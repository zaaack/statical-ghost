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



var tplTemp = Temp.create(function (name, prefix) {
      prefix = prefix || ''
      var tplFile = config.getTpl(name)
      if (fs.existsSync(tplFile)) {
        return hbs.precompile(fs.readFileSync(tplFile, 'utf-8'))
      } else {
        return ''
      }
    }, 'tpl_')
    .expiredBy(function(name, tempData, tempTime) {
      return fs.statSync(config.getTpl(name)).mtime.getTime() > tempTime
    })

// var tplFile = config.paths.theme + '/'+name+'.hbs'
// return hbs.compile(fs.readFileSync(tplFile, 'utf-8'))

var __RENDERS__ = {};


var tpl
var View = {
  buildTemp: function() {
    ;['post', 'author', 'index', 'page', 'tag', 'default'].forEach(function(tplName) {
      tplTemp.get(tplName)
    })
  },
  render: function(tplName, context, dest) {
    if (tplName === 'post' || tplName === 'page') {
      var customTplName = tplName + '-' + context.post.slug
      if (fs.existsSync(config.getTpl(customTplName))) {
        tplName = customTplName
      }
    }
    var bodyTpl = hbs.template(eval('(' + tplTemp.get(tplName) + ')'))
    context.body = bodyTpl(context, {
      data: {
        blog: config.blog,
        config: config
      }
    })
    var html = tpl(context, {
        data: {
          blog: config.blog,
          config: config
        }
      })
      //if it's async, it might miss files because of over max open files limit
    fs.writeFileSync(config.paths.public + dest + 'index.html', html, 'utf-8')
  }
}

module.exports = function(){

  //sg s修改主题时自动更新partial
  registerPartial(__dirname + '/helpers/tpl')
  registerPartial(config.paths.theme + '/partials')
  coreHelpers.loadCoreHelpers(hbs)
  tpl = hbs.template(eval('(' + tplTemp.get('default') + ')'))
  return View
}
