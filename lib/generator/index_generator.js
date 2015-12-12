var _ = require('lodash')
var config = require('../config')
var view = require('../view')
var baseModel = require('../model/base_model')
var indexModel = require('../model/index_model')

var render = view.compile('index')

var model = indexModel.getModel()
var pages = model.getPages()
for (var page = 1; page <= pages; page++) {
  var context = model.getContext(page)
  render(context, context.relativeUrl)
}
