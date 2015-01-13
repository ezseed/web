var express = require('express')
var fs = require('fs')

module.exports = function(router, app, config) {
  app.use(express.static(__dirname, {maxAge: 3600}))

  app.engine('ntl', function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
      if (err) throw new Error(err);
      var rendered = content.toString().replace('#basepath#', options.basepath)
      return callback(null, rendered)
    })
  })

  app.set('view engine', 'ntl') // register the template engine

  app.set('views', __dirname) // specify the views directory

  //main view
  router.get('/', function(req, res){
    res.render('index', {basepath: config.basepath || '/'})
  })

  router.get('/locales.json', function(req, res) {
    res.json(require('./locales/locale-'+req.query.lang))
  })

}
