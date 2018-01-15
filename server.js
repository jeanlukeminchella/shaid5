var express = require('express');
var app = express();
var fs = require("fs");
var http = require("http");

var server = http.createServer(function (req, resp) {
    
        fs.readFile("index.html", function (error, pgResp) {
            
        resp.writeHead(200);
        resp.write(pgResp);
             
             
            resp.end();
        });
    
});


server.listen(8080);

console.log('Server running at http://127.0.0.1:8080/');

app.get('/index', function(req, resp){
  res.sendFile("index.html")
});




