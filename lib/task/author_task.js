var _ = require('lodash')
var config = require('../config')
var baseModel = require('../model/base_model')
var authorModel = require('../model/author_model')
var rssModel = require('../model/rss_model')
var fs = require('../utils/fs-plus2')

module.exports = {
  getTasks: function() {
    if(baseModel.getNewPosts().length === 0){
      return []
    }
    if(!fs.existsSync(config.getTpl('author'))){
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
      // return tasks.concat(rssModel.getRssTask('author', config.authors[slug], model))
      return tasks
    }, [])
  }
}
