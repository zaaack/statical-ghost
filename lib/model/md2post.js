var fsPlus = require('fs-plus')
var fs = require('fs')
var path = require('path')
var config = require('../config')
var yaml = require('js-yaml')
var _ = require('lodash')
var md = require('../utils/markdownit')
var logger = require('../utils/logger')
var path = require('path');

function content2post(file) {
  var content = fsPlus.readFileSync(file, 'utf-8')
  var markdown, post
  try {
    var match = content.match(/^([\w\W]*?)\n\s*\-{3,}\s*/)
    post = yaml.safeLoad(match[1])
    markdown = content.substring(match[0].length)
    post.html = md.render(markdown)
    var title = path.basename(file, '.md')

    if(!post.title) post.title = title
    if(!post.slug) post.slug = title
  } catch (e) {
    logger.logAndThrowError(e)
  }
  return post
}

function stat2post(file) {
  var stat = fs.statSync(file)
  return {
    status: 'published',
    markdown: true,
    created_at: stat.birthtime.getTime(),
    updated_at: stat.mtime.getTime(),
    published_at: stat.birthtime.getTime(),
    page: false,
    featured: false
  }
}

function md2post(file) {
  var postFromStat = stat2post(file)
  var postFromContent = content2post(file)

  var post = _.assign(postFromStat, postFromContent);
  var url = config.urlPathForPost(post, config.posts.permalinks)

  post = _.assign(post, {
    url: url,
    author: postFromContent.author && config.authors[postFromContent.author] || config.authors[config.author],
    tags: postFromContent.tags && postFromContent.tags.map(function(tag) {
      if (tag in config.tags) {
        return config.tags[tag]
      } else {
        return {
          name: tag,
          slug: tag
        }
      }
    })
  })
  return post
}


module.exports = md2post
