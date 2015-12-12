var baseModel = require('./base_model')


module.exports = {
  getContext: function(post) {
    var context = {
      relativeUrl: post.url,
      context: ["post"],
      post: post,
    }
    return context
  }
}
