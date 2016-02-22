var _ = require('lodash')
var config = require('../config')
var indexModel = require('../model/index_model')
var rssModel = require('../model/rss_model')
var baseModel = require('../model/base_model')
var fs = require('../utils/fs-plus2')
var logger = require('../utils/logger')

module.exports = {
  getTasks: function() {
    if (baseModel.getNewPosts().length === 0) {
      logger.warn('no new posts')
      return []
    }
    if(!fs.existsSync(config.getTpl('index'))){
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
  }
}
