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

// ---------------------- STATE
var STATE = {
  show: 0
};

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){

	//load all state things
	socket.emit('audience-connect', STATE);

	socket.on('conductor-start', function(data) {
		console.log('received start from the conductor');
		socket.broadcast.emit('performer-start', data);

		//maybe some reset states?
	});

	socket.on('set-show', function(data){
		STATE.show = data;
		socket.broadcast.emit('set-show', data);
	});

	socket.on('wireframe-toggle', function(data) {
		socket.broadcast.emit('wireframe-toggle', data);
	});

	socket.on('clear-color', function(data) {
		socket.broadcast.emit('clear-color', data);
	});

	socket.on('introduce', function(data){
		socket.broadcast.emit('introduce', data);
	});

	socket.on('toggle', function(data){
		socket.broadcast.emit('toggle', data);
	});

	socket.on('toggle-text', function(data){
		socket.broadcast.emit('toggle-text', data);
	});

	socket.on('fade-out', function(data){
		socket.broadcast.emit('fade-out', data);
	});

	socket.on('fade-in', function(data){
		socket.broadcast.emit('fade-in', data);
	});

	// -------------------------------------- BACKGROUND
	// -------------------------------------- BACKGROUND
	// -------------------------------------- BACKGROUND
	// -------------------------------------- BACKGROUND

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

	socket.on('bg-flip-reset', function(data) {
		socket.broadcast.emit('bg-flip-reset', data);
	});

	// -------------------------------------- COMET
	// -------------------------------------- COMET
	// -------------------------------------- COMET
	// -------------------------------------- COMET

	socket.on('comet-rotation', function(data) {
		socket.broadcast.emit('comet-rotation', data);
	});

	socket.on('comet-distort-start', function(data) {
		socket.broadcast.emit('comet-distort-start', data);
	});

	socket.on('comet-distort-coeff', function(data) {
		socket.broadcast.emit('comet-distort-coeff', data);
	});

	socket.on('comet-gravitation-coeff', function(data) {
		socket.broadcast.emit('comet-gravitation-coeff', data);
	});

	socket.on('comet-gravitation-speed', function(data) {
		socket.broadcast.emit('comet-gravitation-speed', data);
	});

	socket.on('comet-orbit-coeff', function(data) {
		socket.broadcast.emit('comet-orbit-coeff', data);
	});


	// -------------------------------------- WORLD
	// -------------------------------------- WORLD
	// -------------------------------------- WORLD
	// -------------------------------------- WORLD

	socket.on('world-rotation', function(data){
		socket.broadcast.emit('world-rotation', data);
	});

	socket.on('world-geometry', function(data){
		socket.broadcast.emit('world-geometry', data);
	});

	socket.on('toggle-spheredrop', function(data){
		socket.broadcast.emit('toggle-spheredrop', data);
	});

	// -------------------------------------- TRACES
	// -------------------------------------- TRACES
	// -------------------------------------- TRACES
	// -------------------------------------- TRACES

	socket.on('traces-depth', function(data){
		socket.broadcast.emit('traces-depth', data);
	});

	socket.on('traces-step', function(data){
		socket.broadcast.emit('traces-step', data);
	});


	socket.on('traces-oscill', function(data){
		socket.broadcast.emit('traces-oscill', data);
	});
});
