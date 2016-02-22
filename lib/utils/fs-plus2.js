var fs = require('fs-plus')
var path = require('path')

function assign(){
  return [].slice.call(arguments).reduce(function(dst, obj){
    return Object.keys(obj).reduce(function(dst, key){
      dst[key] = obj[key]
      return dst
    }, dst)
  }, {})
}

function copyFile(src, dst){
  fs.makeTree(path.dirname(dst), function(err){
    err && console.error(err)
    fs.createReadStream(src)
      .pipe(fs.createWriteStream(dst))
  })
}

var copySync = fs.copySync
module.exports = assign(fs, {
  copy: function(src, dst, filter){
    var fs = this
    if(!fs.existsSync(src)){
      return false
    }
    var srcStat = fs.statSync(src)
    if(srcStat.isDirectory()){
      fs.readdir(src, function(err, children){
        err && console.error(err)
        children.forEach(function(child){
          fs.copy(src+'/'+child, dst+'/'+child)
        })
      })
    }else if(!filter || filter(src, dst)){
      copyFile(src, dst)
    }
  },
  copySync: function(src, dst, filter){
    var fs = this
    if(!fs.existsSync(src)){
      return false
    }
    var srcStat = fs.statSync(src)
    if(srcStat.isDirectory()){
      copySync.call(fs, src, dst)
    }else if(!filter || filter(src, dst)){
      copyFile(src, dst)
    }
  },
  walkSync: function (root, cb){
    var fs = this
    var children = fs.readdirSync(root)
    children.forEach(function(child){
      var childFile = root + '/' + child
      var stat = fs.statSync(childFile)
      cb && cb(childFile, stat)
      if(stat.isDirectory()){
        fs.walkSync(childFile, cb)
      }
    })
  }

})
