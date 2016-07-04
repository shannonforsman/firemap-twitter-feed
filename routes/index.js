var express = require('express')
var router = express.Router()
var unirest = require('unirest')
var bcrypt = require('bcryptjs')
var db = require('monk')(process.env.MONGOLAB_URI)
var users = db.get('users')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express'})
})

router.get('/saved-fires', function (req, res, next) {
  if (req.session.id) {
    res.render('saved-map', { title: 'Express'})
  } else {
    res.redirect('/')
  }
})

router.post('/register', function (req, res, next) {
  console.log(req.body)
  var errors = []
  if (!req.body.email) {
    errors.push("email can't be blank")
  }
  if (!req.body.password) {
    errors.push("password can't be blank")
  }
  if (errors.length) {
    res.render('register', {error: errors})
  } else {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    req.body.savedFires = []
    users.insert(req.body , function (err, doc) {
      req.session.id = doc._id
      res.redirect('/refresh')
    })
  }
})

router.post('/login', function (req, res, next) {
  var errors = []
  if (!req.body.email) {
    errors.push("email can't be blank")
  }
  if (!req.body.password) {
    errors.push("password can't be blank")
  }
  if (errors.length) {
    res.render('login', {error: errors})
  } else {
    users.findOne({email: req.body.email}, function (err, doc) {
      if (doc === null) {
        errors.push('username or password is incorrect')
        res.render('login', {error: errors})
        return
      } else {
        bcrypt.compare(req.body.password, doc.password, function (err, docB) {
          if (docB) {
            req.session.id = doc._id
            res.redirect('/')
          } else {
            errors.push('username or password is incorrect')
            res.render('login', {error: errors})
          }
        })
      }
    })
  }

})

router.get('/refresh', function (req, res) {
  res.redirect('/')
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.get('/register', function (req, res) {
  res.render('register')
})

router.get('/logout', function (req, res, next) {
  req.session = null
  res.redirect('/')
})

module.exports = router
