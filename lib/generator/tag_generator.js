var _ = require('lodash')
var config = require('../config')
var view = require('../view')
var baseModel = require('../model/base_model')
var tagModel = require('../model/tag_model')

var render = view.compile('tag')

module.exports = {
  generate: function(){
    Object.keys(config.tags).forEach(function (slug) {
      var model = tagModel.getModel(slug)
      var pages = model.getPages()
      for (var page = 1; page <= pages; page++) {
        var context = model.getContext(page)
        render(context, context.relativeUrl)
      }
    })
  }
}
