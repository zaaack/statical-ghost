var md2post = require('./md2post')
var fs = require('../utils/fs-plus2')
var config = require('../config')
var Temp = require('../utils/temp')
var path = require('path')
var _ = require('lodash')

var newPosts, posts

function preNext(post) {
  post.html = post.html || ''
  var html = post.html.replace(/\<.+?\>/g, '')
  return {
    title: post.title,
    slug: post.slug,
    url: post.url,
    markdown: true,
    html: html.substring(0, Math.min(100, html.length))
  }
}

function loadPosts() {
  var postsMap = Temp.get('postsMap', {})
  var postsSort = Temp.get('postsSort', [])
  var newAddedPosts = []
  newPosts = []

  var lastPostTime = Temp.getBuildInfo('lastPostTime', 0)
  fs.walkSync(config.paths.posts, function(file, stat) {
    if (stat.isDirectory()) return
    var filePath = path.relative(config.paths.posts, file)
    if (stat.mtime.getTime() >= lastPostTime) {
      var post = md2post(file, stat)
      post.filePath = filePath
      if (!(filePath in postsMap)) {
        newAddedPosts.push(post)
      }
      newPosts.push(post)
      postsMap[filePath] = post
    }
  })

  postsSort = newAddedPosts.sort(function(a, b) {
    if (a.top ^ b.top) {
      return a.top ? -1 : 1
    }
    return b.updated_at - a.updated_at
  }).map(function(post) {
    return post.filePath
  }).concat(postsSort)

  if (newPosts.length > 0) {
    Temp.set('postsMap', postsMap)
  }
  if (newAddedPosts) {
    Temp.set('postsSort', postsSort)
  }

  posts = postsSort.map(function(filePath) {
    return postsMap[filePath]
  })
  posts.reduce(function(prev, next) {
    prev.next_post = preNext(next)
    next.prev_post = preNext(prev)
    return next
  })
  return this
}

module.exports = {
  init: loadPosts,
  getAllPosts: function() {
    posts.length === 0 && console.trace(posts)
    return posts
  },
  getNewPosts: function() {
    return newPosts
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
