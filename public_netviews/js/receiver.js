const SOCKET_SERVER_URL = "localhost:4783";

var socket = io.connect(SOCKET_SERVER_URL);

socket.on('connect', function(){
	console.log('client socket connected to', SOCKET_SERVER_URL);

});

socket.on('performer-start', function(){
	IS_PLAYING = true;
	console.log('it has begun');
	begin();
});

socket.on('introduce', function(value){
	switch(value){
		case 'background':
			introduceBackground();
			break;
		case 'comet':
			introduceComet();
			break;
		case 'world':
			introduceWorld();
			break;
		case 'traces':
			introduceTraces();
			break;
		default:
			console.log('unexpected value for wireframe toggle');
			break;
	}
});

socket.on('toggle', function(value){
	switch(value){
		case 'background':
			toggleBackground();
			break;
		case 'comet':
			toggleComet();
			break;
		case 'world':
			toggleWorld();
			break;
		case 'traces':
			toggleTraces();
			break;
		default:
			console.log('unexpected value for wireframe toggle');
			break;
	}
});

socket.on('wireframe-toggle', function(value){
	switch(value){
		case 'background':
			toggleBgWireframe();
			break;
		case 'comet':
			toggleCometWireframe();
			break;
		case 'world':
			toggleWorldWireframe();
			break;
		case 'traces':
			toggleTracesWireframe();
			break;
		default:
			console.log('unexpected value for wireframe toggle');
			break;
	}
});

// -------------------------------------- BACKGROUND
// -------------------------------------- BACKGROUND
// -------------------------------------- BACKGROUND
// -------------------------------------- BACKGROUND
//lfo is intensity of everything
//bg_scale_x 0-2
//bg_scale_y 0-2
//bg_flip_toggle (get new rotation) bool
//bg_color_toggle (get new color) bool
//bg_oscillation_coeff 0-2

socket.on('bg-scale-x', function(value){
	bg_scale_x = value;
});

socket.on('bg-scale-y', function(value){
	bg_scale_y = value;
});

socket.on('bg-oscill-coeff', function(value){
	bg_oscillation_coeff = value;
});

socket.on('bg-flip-toggle', function(value){
	bg_flip_toggle = value;
});

// -------------------------------------- COMET
// -------------------------------------- COMET
// -------------------------------------- COMET
// -------------------------------------- COMET

socket.on('comet-rotation', function(value){
	comet_rotation_coeff = value;
});

socket.on('comet-distort-start', function(value){
	tweenComet();
});

socket.on('comet-distort-coeff', function(value){
	comet_distort_coeff = value;
});

socket.on('comet-gravitation-coeff', function(value){
	comet_gravitation_coeff = value;
});

socket.on('comet-gravitation-speed', function(value){
	comet_gravitation_speed = value;
});

// -------------------------------------- WORLD
// -------------------------------------- WORLD
// -------------------------------------- WORLD
// -------------------------------------- WORLD

socket.on('world-rotation', function(data){
	if(data.axis == 'x')
		world_rotation_x_coeff =  data.value;
	if(data.axis == 'y')
		world_rotation_y_coeff =  data.value;
	if(data.axis == 'z')
		world_rotation_z_coeff =  data.value;
});

socket.on('world-geometry', function(data){
	switchWorldGeometry();
});

// -------------------------------------- TRACES
// -------------------------------------- TRACES
// -------------------------------------- TRACES
// -------------------------------------- TRACES


socket.on('clear-color', function(value){
	clearColor(value);
});
