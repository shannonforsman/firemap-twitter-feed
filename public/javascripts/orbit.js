var Orbit = function () {}

Orbit.prototype.get = function (path, fn) {
  var req = new XMLHttpRequest()
  req.open('GET', path)
  req.send()
  req.addEventListener('load', fn.bind(req))
}

Orbit.prototype.post = function (path, data, fn) {
  var req = new XMLHttpRequest()
  req.open('POST', path)
  req.setRequestHeader('Content-Type', 'application/json')
  req.send(data)
  req.addEventListener('load', fn.bind(req))
}
