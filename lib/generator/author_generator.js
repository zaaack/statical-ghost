var _ = require('lodash')
var config = require('../config')
var view = require('../view')
var baseModel = require('../model/base_model')
var authorModel = require('../model/author_model')

var render = view.compile('author')

Object.keys(config.authors).forEach(function (slug) {
  var model = authorModel.getModel(slug)
  var pages = model.getPages()
  for (var page = 1; page <= pages; page++) {
    var context = model.getContext(page)
    render(context, context.relativeUrl)
  }
})
