var _ = require('lodash')
var config = require('../config')
var view = require('../view')
var indexModel = require('../model/index_model')
var rssModel = require('../model/rss_model')
var baseModel = require('../model/base_model')

module.exports = {
  getTasks: function() {
    if (baseModel.getNewPosts().length === 0) {
      console.log('no new posts')
      return []
    }

    var tasks = []
    var model = indexModel.getModel()
    var pages = model.getPages()
    for (var page = 1; page <= pages; page++) {
      var context = model.getContext(page)
      tasks.push({
          tpl: 'index',
          context: context
        })
        // render(context, context.relativeUrl)
    }
    return tasks.concat(rssModel.getRssTask('home', config.blog, model))
  },
  generate: function() {
    var render = view.compile('index')
    this.getTasks().forEach(function(task) {
      render(task.context, task.context.relativeUrl)
    })
  }
}
