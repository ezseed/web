var express = require('express')
var app = express()

// var p = require('path')

// var sock_path = 8970 //p.join(__dirname, 'ezseed.sock')
//module.exports = function(app) {
	app.use(express.static(__dirname ));

	app.get('/', function(req, res){
		res.render('index.html')
	})
	
app.listen(8970)

//}


