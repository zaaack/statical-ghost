function emit(event, data) {
  process.send({
    event: event,
    data: data
  })
}

process.on('message', function(data) {
  if (data.event === 'startTask') {
    var ret
    try {
      var fn = eval('(' + data.data.fn + ')')
      ret = fn.call(this, data.data.args, emit)
    } catch (e) {
      console.error(e)
    }
    emit('finish', ret)
    if (data.data.autoKill) {
      process.exit(0)
    }
  }
});
