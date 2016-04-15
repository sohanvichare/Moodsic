var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var tesseract = require('node-tesseract');
var sentimentAnalysis = require('sentiment-analysis');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    var base64Data = msg;
    console.log('recieved')
    require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
      console.log(err);
    });
    tesseract.process(__dirname + '/out.png',function(err, text) {
    	if(err) {
    		console.error(err);
    	} else {
    		console.log(text);
        var toSend = sentimentAnalysis(text);
        socket.emit('res', toSend)
    	}
    });
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});
