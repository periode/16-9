var http = require('http');
var express = require('express');

var app = express();
var port = 4783;

var server = http.createServer(app).listen(port, function(error){
	if(error)
		console.log(error);
	console.log("server started on port",port);
});

app.use(express.static('public_netviews'));

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	socket.on('conductor-start', function(data) {
		console.log('received start from the conductor');
		socket.broadcast.emit('performer-start', data);
	});

	socket.on('bg-scale-x', function(data) {
		socket.broadcast.emit('bg-scale-x', data);
	});

	socket.on('bg-scale-y', function(data) {
		socket.broadcast.emit('bg-scale-y', data);
	});

	socket.on('bg-oscill-coeff', function(data) {
		socket.broadcast.emit('bg-oscill-coeff', data);
	});

	socket.on('bg-flip-toggle', function(data) {
		socket.broadcast.emit('bg-flip-toggle', data);
	});

	socket.on('bg-color-toggle', function(data) {
		socket.broadcast.emit('bg-color-toggle', data);
	});
});
