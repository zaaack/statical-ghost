var _ = require('lodash')
var config = require('../config')
var view = require('../view')
var baseModel = require('../model/base_model')
var postModel = require('../model/post_model')

var posts = baseModel.getAllPosts()
var render = view.compile('post')

posts.forEach(function (post) {
  var context = postModel.getContext(post)
  render(context, context.relativeUrl)
})
