var express = require('express')
var app = express()

var p = require('path')

var sock_path = 8970 //p.join(__dirname, 'ezseed.sock')

app.use(express.static(__dirname ));

app.get('/', function(req, res){
	res.render('index.html')
})

app.listen(sock_path, function() {
	console.log('Server listening on %s', sock_path)
})

process.on('exit', function() {
	require('rimraf').sync(sock_path)
})

process.on('SIGINT', function() {
	require('rimraf').sync(sock_path)
	
	setTimeout(function() { process.exit(0) })	
})