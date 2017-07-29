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
  show: 0,
	clearColor: "black",
	wireframe:{
		background: false,
		comet: false,
		world: false,
		traces: false,
	},
	introduce:{
		"background": false,
		"comet": false,
		"world": false,
		"traces": false,
		"noise": false,
		"cube": false,
		"sphere": false
	},
	toggle:{
		"background": false,
		"comet": false,
		"world": false,
		"traces": false,
		"noise": false,
		"cube": false,
		"sphere": false
	},
	toggleText:{
		"netviews": true,
		"wuso": false,
		"wosx": false
	},
	background:{
		scale:{
			x: 0.01,
			y: 0.01
		},
		oscill: 0.01,
		flip : false,
		reset: false
	},
	comet:{
		rotation:0,
		distort:{
			start: false,
			coeff: 0
		},
		gravitation:{
			coeff: 0,
			speed: 0
		},
		orbit: {
			phi: 1,
			theta:2
		}
	},
	world:{
		rotation:{
			x: 0,
			y: 0,
			z: 0
		},
		geometry: false,
		spheredrop: false
	},
	traces:{
		depth: 1,
		step: 0.1,
		oscill: {
			coeff:{
				x: 0.1,
				y: 0.1
			},
			speed:{
				x: 0.8,
				y: 3
			}
		}
	},
	sphere: {
		position:0,
		radius:0,
		angle: 0,
		mode: 0
	},
	cube: {
		rotation: {
			x: 0.00005,
			y: 0.001,
			z: 0
		},
		lines: {
			down: 0,
			interval: 0
		},
		invert: false,
		clap: false,
	},
	noise: {
		interval:{
			vertinterval: 50.0,
			vertspeed: 0.01,
			coeff: 0,
			modulo: 100,
			speed: 20
		},
		bloom:{
			speed: 0.001,
			intensity: 0.00001,
		},
		tan: {
			size: 0.1,
			modulo: 20,
		},
		overlay:{
			distance: 6.0,
			size: 0.005,
			speed: 0.0001,
			impact: 1
		}
	},
	her: "salber"
};

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){

	//load all state things
	socket.emit('audience-connect', STATE);


//-------------DEPRECATED?
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
		STATE.wireframe[data] = true;
		socket.broadcast.emit('wireframe-toggle', data);
	});
	socket.on('clear-color', function(data) {
		STATE.clearColor = data;
		socket.broadcast.emit('clear-color', data);
	});
	socket.on('introduce', function(data){
		STATE.introduce[data] = true;
		socket.broadcast.emit('introduce', data);
	});
	socket.on('remove-actor', function(data){
		STATE.introduce[data] = false;
		socket.broadcast.emit('remove-actor', data);
	});
	socket.on('toggle', function(data){
		STATE.toggle[data] = !STATE.toggle[data];
		socket.broadcast.emit('toggle', data);
	});
	socket.on('toggle-text', function(data){
		STATE.toggleText[data] = !STATE.toggleText[data];
		socket.broadcast.emit('toggle-text', data);
	});

	// -------------------------------------- BACKGROUND

	socket.on('bg-scale-x', function(data) {
		STATE.background.scale.x = data;
		socket.broadcast.emit('bg-scale-x', data);
	});
	socket.on('bg-scale-y', function(data) {
		STATE.background.scale.y = data;
		socket.broadcast.emit('bg-scale-y', data);
	});
	socket.on('bg-oscill-coeff', function(data) {
		STATE.background.oscill.coeff = data;
		socket.broadcast.emit('bg-oscill-coeff', data);
	});
	socket.on('bg-flip-toggle', function(data) {
		STATE.background.flip = !STATE.background.flip;
		socket.broadcast.emit('bg-flip-toggle', data);
	});
	socket.on('bg-flip-reset', function(data) {
		STATE.background.flip = false;
		socket.broadcast.emit('bg-flip-reset', data);	});

	// -------------------------------------- COMET

	socket.on('comet-rotation', function(data) {
		STATE.comet.rotation = data;
		socket.broadcast.emit('comet-rotation', data);
	});
	socket.on('comet-distort-start', function(data) {
		STATE.comet.distort.start = true;
		socket.broadcast.emit('comet-distort-start', data);
	});
	socket.on('comet-distort-coeff', function(data) {
		STATE.comet.distort.coeff = data;
		socket.broadcast.emit('comet-distort-coeff', data);
	});
	socket.on('comet-gravitation-coeff', function(data) {
		STATE.comet.gravitation.coeff = data;
		socket.broadcast.emit('comet-gravitation-coeff', data);	});
	socket.on('comet-gravitation-speed', function(data) {
		STATE.comet.gravitation.speed = data;
		socket.broadcast.emit('comet-gravitation-speed', data);	});
	socket.on('comet-orbit-coeff', function(data) {
		STATE.comet.orbit[data.angle] = data.value;
		socket.broadcast.emit('comet-orbit-coeff', data);	});


	// -------------------------------------- WORLD

	socket.on('world-rotation', function(data){
		STATE.world.rotation[data.axis] = data.value;
		socket.broadcast.emit('world-rotation', data); });
	socket.on('world-geometry', function(data){
		STATE.world.geometry = true;
		socket.broadcast.emit('world-geometry', data); });
	socket.on('toggle-spheredrop', function(data){
		STATE.world.spheredrop = !STATE.world.spheredrop;
		socket.broadcast.emit('toggle-spheredrop', data);});

	// -------------------------------------- TRACES

	socket.on('traces-depth', function(data){
		STATE.traces.depth = data;
		socket.broadcast.emit('traces-depth', data); });
	socket.on('traces-step', function(data){
		STATE.traces.depth = data;
		socket.broadcast.emit('traces-step', data);	});
	socket.on('traces-oscill', function(data){
		STATE.traces.oscill[data.type][data.axis] = data.value;
		socket.broadcast.emit('traces-oscill', data);	});

	// -------------------------------------- SPHERE

	socket.on('explosion-position', function(data){
		STATE.sphere.position = 1;
		socket.broadcast.emit('explosion-position', data); });
	socket.on('explosion-radius', function(data){
		STATE.sphere.radius = data;
		socket.broadcast.emit('explosion-radius', data); });
	socket.on('explosion-angle', function(data){
		STATE.sphere.angle += data;
		socket.broadcast.emit('explosion-angle', data); });
	socket.on('sphere-mode', function(data){
		STATE.sphere.mode = data;
		socket.broadcast.emit('sphere-mode', data);	});

	// -------------------------------------- CUBE

	socket.on('cube-rotation', function(data){
		STATE.cube.rotation[data.axis] = data.value;
		socket.broadcast.emit('cube-rotation', data);	});
	socket.on('cube-background-lines', function(data){
		STATE.cube.lines[data.property] = data.value;
		socket.broadcast.emit('cube-background-lines', data);	});
	socket.on('cube-clap', function(data){
		STATE.cube.clap = !STATE.cube.clap;
		socket.broadcast.emit('cube-clap', data);	});
	socket.on('cube-invert', function(data){
		STATE.cube.invert = !STATE.cube.invert;
		socket.broadcast.emit('cube-invert', data);	});

	// -------------------------------------- NOISE

	socket.on('noise-interval', function(data){
		STATE.noise.interval[data.property] = data.value;
		socket.broadcast.emit('noise-interval', data);	});
	socket.on('noise-bloom', function(data){
		STATE.noise.bloom[data.property] = data.value;
		socket.broadcast.emit('noise-bloom', data);	});
	socket.on('noise-tan', function(data){
		STATE.noise.tan[data.property] = data.value;
		socket.broadcast.emit('noise-tan', data);	});
	socket.on('noise-overlay', function(data){
		STATE.noise.overlay[data.property] = data.value;
		socket.broadcast.emit('noise-overlay', data);	});

});
