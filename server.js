var http = require('http');
var express = require('express');

var app = express();
var port = 4783;

var server = http.createServer(app).listen(port, function(error){
	if(error)
		console.log(error);
	console.log("server started on port",port);
});

app.use(express.static('public'));

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	socket.on('conductor-start', (data) => {
		console.log('received start from the conductor');
		socket.broadcast.emit('performer-start', data);
	});
});
