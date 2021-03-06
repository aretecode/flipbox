// https://raw.githubusercontent.com/kamicane/microseconds/master/parse.js
var toString = function() {
  var microseconds = this.microseconds,
    milliseconds = this.milliseconds,
    seconds = this.seconds,
    minutes = this.minutes,
    hours = this.hours,
    days = this.days

  var parts = [{
    name: 'day',
    value: days,
  }, {
    name: 'hour',
    value: hours,
  }, {
    name: 'minute',
    value: minutes,
  }, {
    name: 'second',
    value: seconds,
  }, {
    name: 'millisecond',
    value: milliseconds,
  }, {
    name: 'microsecond',
    value: microseconds,
  }]

  var time = []

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i]
    if (part.value === 0) {
      if (!time.length) continue // nothing was added yet

      var broken = false

      for (var j = i; j < parts.length; j++) {
        var p = parts[j]
        if (p.value) {
          broken = true
          break
        }
      }

      if (!broken) break
    }

    time.push(part.value, part.value === 1 ? part.name : part.name + 's')
  }

  return time.join(' ')
}

module.exports = function parse(nano) {
  var ms = nano / 1000
  var ss = ms / 1000
  var mm = ss / 60
  var hh = mm / 60
  var dd = hh / 24

  var microseconds = Math.round((ms % 1) * 1000)
  var milliseconds = Math.floor(ms % 1000)
  var seconds = Math.floor(ss % 60)
  var minutes = Math.floor(mm % 60)
  var hours = Math.floor(hh % 24)
  var days = Math.floor(dd)

  return {microseconds, milliseconds, seconds, minutes, hours, days, toString}
}
