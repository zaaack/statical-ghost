var postsGenerator = require('./posts_generator')
var authorGenerator = require('./author_generator')
var indexGenerator = require('./index_generator')
var tagGenerator = require('./tag_generator')

module.exports = {
  generate: function() {
    postsGenerator.generate()
    authorGenerator.generate()
    indexGenerator.generate()
    tagGenerator.generate()
  }
}
