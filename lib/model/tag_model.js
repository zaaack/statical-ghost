var baseModel = require('./base_model')
var config = require('../config')
var _ = require('lodash')

var getTagPosts = function(){
  var tags = config.getConfigFromFile().tags || {}
  var changed = false

  var tagPosts = baseModel.getAllPosts().reduce(function(tagPosts, post) {
    post.tags && post.tags.forEach(function(tag) {
      if (!(tag.slug in tagPosts)) {
        tagPosts[tag.slug] = [post]
        if (Object.keys(tags).every(function(slug) {
            return slug !== tag.slug
          })) {
          tags[tag.slug] = tag
          changed = true
        }
      } else {
        tagPosts[tag.slug].push(post)
      }
    })
    return tagPosts
  }, {})

  changed && config.writeConfigToFile({tags: tags})

  return tagPosts
}

function Model(slug, tagPosts){
  var self = this
  this.slug = slug

  self.posts = tagPosts[slug] || []
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
      context: ["tag"],
      posts: postsContext.posts,
      pagination: postsContext.pagination,
      tag: config.tags[self.slug] || {
        name: self.slug,
        slug: self.slug
      }
    }
    context.relativeUrl = config.urlFor('tag', context)
    return context
  }
}

module.exports = {
  init: function(){
    this.tagPosts = getTagPosts()
    return this
  },
  getTagSlugs: function() {
    return Object.keys(config.tags)
  },
  getModel: function(slug) {
    return new Model(slug, this.tagPosts)
  }
}
