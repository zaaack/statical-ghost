var RSS = require('rss')
var config = require('../config')

module.exports = {
  getRssTask: function(context, info, model, extras) {
    var posts = model.posts.slice(0, Math.min(model.posts.length, 20))
    var data = model.getContext(1)
    var siteUrl = config.urlFor(context, data, true)
    var title = context === 'home'? config.blog.title: config.blog.title + '_' + context + '_' + info.name
    var feed = new RSS({
      title: title,
      description: info.description || info.meta_description || '',
      feed_url: siteUrl + 'rss.xml',
      site_url: siteUrl,
      pubDate: new Date().getTime(),
      custom_elements: extras || []
    })
    posts.forEach(function(post) {
      feed.item({
        title: post.title,
        description: post.meta_description,
        url: config.blog.url + post.url,
        author: post.author.name,
        date: post.published_at
      })
    })
    return {
      path: config.paths.public + data.relativeUrl + '/rss/index.html',
      rss: feed.xml({indent: true})
    }
  }
}
