var _ = require('lodash')
var config = require('../config')
var view = require('../view')
var baseModel = require('../model/base_model')
var tagModel = require('../model/tag_model')
var rssModel = require('../model/rss_model')
var fs = require('../utils/fs-plus2')


module.exports = {
  getTasks: function() {
    if(baseModel.getNewPosts().length === 0){
      return []
    }
    if(!fs.existsSync(config.getTpl('tag'))){
      return []
    }
    return tagModel.init().getTagSlugs().reduce(function(tasks, slug) {
      var model = tagModel.getModel(slug)
      var pages = model.getPages()
      for (var page = 1; page <= pages; page++) {
        var context = model.getContext(page)
          // render(context, context.relativeUrl)
        tasks.push({
          tpl: 'tag',
          context: context
        })
      }
      // return tasks.concat(rssModel.getRssTask('tag', config.tags[slug], model))
      return tasks
    }, [])
  }
}
