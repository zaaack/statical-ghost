var view = require('../view')

module.exports = {
  getTasks: function() {
    var tasks = []
    ;['author', 'tag', 'index', 'post'].forEach(function(name){
      // if(view.templateTemp.get(name)){ // 若存在缓存才增加这个任务，同时更新或生成缓存文件，避免异步读写文件的bug
        tasks = tasks.concat(require('./' + name + '_task').getTasks())
      // }
    })
    return tasks
  }
}
