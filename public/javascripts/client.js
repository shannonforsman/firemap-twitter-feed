var register = document.getElementById('register')
var login = document.getElementById('login')
var form = document.getElementById('form')
var inner = document.getElementById('inner')
var minimize = document.getElementById('minimize')
var registerForm = document.getElementById('register-form')


register.addEventListener('click', function(e) {
  form.innerHTML = '<form action="/register" method="post"><img src="/images/close-white.png" id="close"><input type="email" name="email" value="" placeholder="email"><input type="password" name="password" placeholder="password"><input type="submit" value="register"  class="button"></form>'
  inner.style.display = 'none'
})

login.addEventListener('click', function() {
  form.innerHTML = '<form action="/login" method="post"><img src="/images/close-white.png" id="close"><input type="email" name="email" value="" placeholder="email"><input type="password" name="password" placeholder="password"><input type="submit" value="login" class="button"></form>'
inner.style.display = 'none'
})

form.addEventListener('click', function(e) {
  if (e.target.id === 'close') {
    form.innerHTML = ''
    inner.style.display = 'block'
  }
  console.log(e.target)
  if (e.target.id === 'close') {
    inner.style.display = 'block'
  }
})

minimize.addEventListener('click', function() {
  console.log('clicked minimize')
  registerForm.classList.toggle("minimize")
})
