today = new Date()
seasonbegin = new Date 'July 1, ' + today.getFullYear()
seasonend = new Date 'December 31, ' + today.getFullYear()

if seasonbegin < today and today < seasonend
  document.getElementById('countdown_info').innerHTML = "Säsongen slutar om"

  delta = Math.floor (seasonend.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) + 1

  document.getElementById('countdown').innerHTML = delta
else
  seasonbegin.setDate seasonbegin.getDate() + 365 if today > seasonend

  delta = Math.floor (seasonbegin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) + 1

  document.getElementById('countdown').innerHTML = delta

if delta == 1
  document.getElementById('countdown_days').innerHTML = "dag"

document.getElementById('contact-us').addEventListener 'click', ->
  shake = document.getElementById('shake')
  shake.className = 'active'
  setTimeout ->
    shake.className = ''
  , 400

# Test whether the browser supports css transforms or not
prefixes = 'transform WebkitTransform MozTransform msTransform'.split(' ')
el = document.createElement 'div'
transform2D = 0
transform2D = document.createElement('div').style[prefixes[transform2D++]] isnt `undefined` or transform2D  while transform2D isnt true
document.documentElement.className = 'csstransforms' if transform2D