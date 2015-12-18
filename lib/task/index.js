var postsTask = require('./posts_task')
var authorTask = require('./author_task')
var indexTask = require('./index_task')
var tagTask = require('./tag_task')


module.exports = {
  getTasks: function() {
    return postsTask.getTasks()
      .concat(authorTask.getTasks())
      .concat(indexTask.getTasks())
      .concat(tagTask.getTasks())
  }
}
