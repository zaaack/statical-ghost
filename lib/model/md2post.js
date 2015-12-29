var fs = require('../utils/fs-plus2')
var fs = require('fs')
var path = require('path')
var config = require('../config')
var yaml = require('js-yaml')
var _ = require('lodash')
var md = require('../utils/markdownit')
var logger = require('../utils/logger')
var path = require('path')
var moment = require('moment')

function content2post(file, stat) {
  var content = fs.readFileSync(file, 'utf-8')
  var markdown, post = {}
  try {
    var match = content.match(/^([\w\W]*?)\n\s*\-{3,}\s*/)
    post = yaml.safeLoad(match[1])
    markdown = content.substring(match[0].length)
    post.html = md.render(markdown)
    if(!('date' in post)){
      post.date = moment(stat.birthtime).format(config.timeFormat)
      content = content.replace(/^([\w\W]*?)\n(\s*\-{3,}\s*)/,'$1\ndate: '+post.date+'\n$2')
      fs.writeFileSync(file, content)
      post.publish_at = stat.birthtime.getTime()
    }else{
      post.publish_at = moment(post.date).valueOf()
    }
  } catch (e) {
    logger.error('post format error:' + file, e)
  }
  var basename = path.basename(file, '.md')
  if (!post.title) post.title = basename
  if (!post.slug) post.slug = basename
  return post
}

function stat2post(file, stat) {
  return {
    status: 'published',
    markdown: true,
    page: false,
    featured: false
  }
}

function md2post(file, stat) {
  var stat = stat || fs.statSync(file)
  var postFromStat = stat2post(file, stat)
  var postFromContent = content2post(file, stat)
  var post = _.assign(postFromStat, postFromContent);
  var url = config.urlPathForPost(post, config.posts.permalinks)

  var author = postFromContent.author && (config.authors[postFromContent.author] || {
    name: postFromContent.author,
    slug: postFromContent.author
  }) || config.authors[config.author]

  var tags = postFromContent.tags || []
  if (typeof tags === 'string') {
    tags = tags.split(',')
  }

  post = _.assign(post, {
    url: url,
    author: author,
    tags: tags.map(function(tag) {
      if (config.tags && (tag in config.tags)) {
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
