var postsGenerator = require('./posts_generator')
var authorGenerator = require('./author_generator')
var indexGenerator = require('./index_generator')
var tagGenerator = require('./tag_generator')


module.exports = {
  getTasks: function() {
    return postsGenerator.getTasks()
      .concat(authorGenerator.getTasks())
      .concat(indexGenerator.getTasks())
      .concat(tagGenerator.getTasks())
  }
}
