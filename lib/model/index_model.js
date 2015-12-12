var baseModel = require('./base_model')
var config = require('../config')
var _ = require('lodash')

module.exports = {
  getModel: function() {
    var self = this
    self.posts = baseModel.getAllPosts()
    self.page = baseModel.getPagination(self.posts, {
      limit: config.posts.limit
    })
    return this
  },

  getPages: function() {
    return this.page.pages
  },

  getContext: function(pageNum) {
    var self = this
    self.page.page = pageNum
    var postsContext = baseModel.getPostsContext(self.posts, self.page)
    var context = {
      context: ["home", 'index'],
      posts: postsContext.posts,
      pagination: postsContext.pagination
    }
    context.relativeUrl = config.urlFor('home', context)
    return context
  }
}
