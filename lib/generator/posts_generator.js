var _ = require('lodash')
var config = require('../config')
var view = require('../view')
var baseModel = require('../model/base_model')
var postModel = require('../model/post_model')

module.exports = {
  getTasks: function() {
    return baseModel.getNewPosts().reduce(function(tasks, post) {
      var context = postModel.getContext(post)
        // render(context, context.relativeUrl)
      tasks.push({
        tpl: 'post',
        context: context
      })
      return tasks
    }, [])
  },
  generate: function() {
    var render = view.compile('post')
    this.getTasks().forEach(function(task) {
      render(task.context, task.context.relativeUrl)
    })
  }
}
