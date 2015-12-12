var md2post = require('./md2post')
var fsPlus = require('fs-plus')
var fs = require('fs')
var config = require('../config')

var posts = []
fsPlus.traverseTreeSync(config.paths.posts, function(file) {
  posts.push(file)
  return true
}, function(dir) { return true })

posts = posts.map(function(file) {
  return md2post(file)
}).sort(function(a, b) {
  return b.updated_at - a.updated_at
})

module.exports = {
  getAllPosts: function() {
    return posts
  },
  getPagination: function(posts, page) {
    page.total = posts.length
    page.pages = Math.ceil(page.total / page.limit)
    return page
  },
  getPostsContext: function(posts, page) {
    page = this.getPagination(posts, page)
    page.next = page.page === page.pages ? null : page.page + 1
    page.prev = page.page === 1 ? null : page.page - 1

    var start = (page.page - 1) * page.limit
    var end = Math.min(page.page * page.limit, page.total)
    return {
      pagination: page,
      posts: posts.slice(start, end)
    }
  }
}
