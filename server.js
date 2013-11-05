var http = require('http');
var fs = require('fs');
var express = require('express');
var clientJS  = require('./client-js');
var clientCSS = require('./styles');

var app = express();

app.use(app.router);

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  var minesweeper = 'minesweeper.html';
  fs.createReadStream(minesweeper).pipe(res);
});

app.get('/app.js', function(req, res){
  res.setHeader('Content-Type', 'text/javascript');
  clientJS().pipe(res);
});

app.get('/app.css', function(req, res){
  res.setHeader('Content-Type', 'text/css');
  clientCSS().pipe(res);
});

app.get('/mine.jpg', function(req, res){
  console.log('mine!');
  res.sendfile('./mine.jpg');
})

var port   = process.env.PORT || 4000

var start  = function() {
  app.listen(port, function() {
    console.log("app running on port: " + port)
  })
}

start();
