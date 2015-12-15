var baseModel = require('./base_model')
var config = require('../config')
var _ = require('lodash')


var getAuthorPosts = function(){
  var authors = config.getConfigFromFile().authors || {}
  var changed = false
  var authorPosts = baseModel.getAllPosts().reduce(function(authorPosts, post) {
    var author = post.author
    if (!(author.slug in authorPosts)) {
      authorPosts[author.slug] = [post]
      if (Object.keys(authors).every(function(slug) {
          return slug !== author.slug
        })) {
        authors[author.slug] = author
        changed = true
      }
    } else {
      authorPosts[author.slug].push(post)
    }
    return authorPosts
  }, {})
  changed && config.writeConfigToFile({ authors: authors })
  return authorPosts
}

function Model(slug, authorPosts){
  var self = this
  self.slug = slug

  self.posts = authorPosts[slug] || []
  self.page = baseModel.getPagination(self.posts, {
    limit: config.posts.limit
  })
}

Model.prototype = {
  getPages: function() {
    return this.page.pages
  },
  getContext: function(pageNum) {
    var self = this
    self.page.page = pageNum
    var postsContext = baseModel.getPostsContext(self.posts, self.page)
    var context = {
      context: ["author"],
      posts: postsContext.posts,
      pagination: postsContext.pagination,
      author: config.authors[self.slug] || {
        name: self.slug,
        slug: self.slug
      }
    }
    context.relativeUrl = config.urlFor('author', context)
    return context
  }
}

module.exports = {
  init: function(){
    this.authorPosts = getAuthorPosts()
    return this
  },
  getAuthorSlugs: function() {
    return Object.keys(config.authors)
  },
  getModel: function(slug) {
    return new Model(slug, this.authorPosts)
  }
}
