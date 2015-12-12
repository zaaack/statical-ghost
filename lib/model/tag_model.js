var baseModel = require('./base_model')
var config = require('../config')
var _ = require('lodash')

module.exports = {
  getModel: function(slug) {
    var self = this
    this.slug = slug

    self.posts = baseModel.getAllPosts()
      .filter(function(post) {
        return post.tags.some(function(tag) {
          return tag.slug === slug
        })
      })
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
      context: ["tag"],
      posts: postsContext.posts,
      pagination: postsContext.pagination,
      tag: config.tags[self.slug]
    }
    context.relativeUrl = config.urlFor('tag', context)
    return context
  }
}
