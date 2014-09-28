var express = require('express')

module.exports = function(app) {
  app.use(express.static(__dirname ), {maxAge: 3600});

  app.get('/', function(req, res){
    res.render('index.html')
  })

  app.get('/locales.json', function(req, res) {
    res.json(require('./locales/locale-'+req.query.lang))
  })
}
