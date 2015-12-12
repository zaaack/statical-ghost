var hbs = require('handlebars')
var config = require('../config')
var coreHelpers = require('./helpers')
var fsPlus = require('fs-plus')
var fs = require('fs')
var path = require('path');

function registerPartial(partialDir) {
  fs.readdirSync(partialDir).forEach(function(name) {
    var file = partialDir + '/' + name
    var partialName = path.basename(name, '.hbs')
    hbs.registerPartial(partialName, fsPlus.readFileSync(file, 'utf-8'))
  })
}

registerPartial(__dirname + '/helpers/tpl')
registerPartial(config.paths.theme + '/partials')

coreHelpers.loadCoreHelpers(hbs)


module.exports = {
  compile: function(template) {
    var tplFile = config.paths.theme + '/default.hbs'
    var tpl = hbs.compile(fsPlus.readFileSync(tplFile, 'utf-8'))
    var bodyTplFile = config.paths.theme + '/' + template + '.hbs'
    var bodyTpl = hbs.compile(fsPlus.readFileSync(bodyTplFile, 'utf-8'))
    return function(context, dest) {
      context.body = bodyTpl(context, {data: {blog: config.blog}})
      var html = tpl(context, {data: {blog: config.blog}})
      fsPlus.writeFileSync(config.paths.public + dest + 'index.html', html, 'utf-8')
    }
  }
}
