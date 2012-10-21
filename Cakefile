{exec} = require 'child_process'
zlib = require 'zlib'
fs = require 'fs'

task 'build:css', 'Compile style.css', ->
  exec 'node_modules/.bin/lessc style/style.less --yui-compress', (err, stdout, stderr) ->
    process.stdout.write stdout

task 'build:html', 'Build website', ->
  script = ''

  next = (err, stdout, stderr) ->
    script += stdout
    unless script is stdout
      exec "node_modules/.bin/jade -o '#{JSON.stringify({'script':script})}' < index.jade", (err, stdout, stderr) ->
        # should only remove quotes inside html tags
        # stdout = stdout.replace(/(class|href|alt|src|height|width|name|charset|content|id|title|type|media|frameborder|scrolling)=["']([\x21-\x7E]+)["']/gm, '$1=$2')

        process.stdout.write stdout

  exec 'cat script.js | node_modules/.bin/uglifyjs -nm', next
  exec 'cat script.coffee | node_modules/.bin/coffee -sc | node_modules/.bin/uglifyjs -nc', next

task 'deploy', 'Build and send website to s3 bucket', ->
  #readline
  s3 = require './s3'

  s3 = require('knox').createClient s3

  # When both are finished - send data to a function for fingerprinting filenames

  exec 'cake build:html', (err, stdout, stderr) ->
    zlib.gzip stdout, (err, buffer) ->
      headers =
        'Content-Type': 'text/html'
        'Content-Encoding': 'gzip'

      s3.putBuffer buffer, '/index.html', headers, () ->
        console.log 'html'

  exec 'cake build:css', (err, stdout, stderr) ->
    zlib.gzip stdout, (err, buffer) ->
      headers =
        'Content-Type': 'text/css'
        'Content-Encoding': 'gzip'

      s3.putBuffer buffer, '/style.css', headers, () ->
        console.log 'css'

# TODO: Move asset deployment into deploy and fingerprint assets
task 'deploy:assets', 'Upload assets folder to S3', ->
  exec 's3cmd put --add-header="Cache-Control":"max-age=259200, public" assets/* s3://svenskkrafta.se/assets/'  