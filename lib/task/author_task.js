var _ = require('lodash')
var config = require('../config')
var view = require('../view')
var baseModel = require('../model/base_model')
var authorModel = require('../model/author_model')
var rssModel = require('../model/rss_model')

module.exports = {
  getTasks: function() {
    if(baseModel.getNewPosts().length === 0){
      return []
    }
    return authorModel.init().getAuthorSlugs().reduce(function(tasks, slug) {
      var model = authorModel.getModel(slug)
      var pages = model.getPages()
      for (var page = 1; page <= pages; page++) {
        var context = model.getContext(page)
          // render(context, context.relativeUrl)
        tasks.push({
          tpl: 'author',
          context: context
        })
      }
      return tasks.concat(rssModel.getRssTask('author', config.authors[slug], model))
    }, [])
  }
}
