const SOCKET_SERVER_URL = "104.236.239.60:4783";
const SOCKET_LOCALHOST = "localhost:4783";

var socket = io.connect(SOCKET_LOCALHOST);

socket.on('connect', function(){
	console.log('client socket connected to', SOCKET_SERVER_URL);

});

socket.on('audience-connect', function(state){
	console.log('newly connected, updating to current state');
	// begin(state.show);
	begin(1);
});

socket.on('set-show', function(index){
	setShow(index);
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
		case 'noise':
			introduceNoise();
			break;
		case 'cube':
			introduceCube();
		break;
		case 'sphere':
			introduceSphere();
			break;
		default:
			console.log('unexpected value for introduction');
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
			console.log('unexpected value for visibility toggle');
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

socket.on('fade-out', function(value){
	switch(value){
		case 'background':
			fadeOutBackground();
			break;
		case 'comet':
			fadeOutComet();
			break;
		case 'world':
			fadeOutWorld();
			break;
		case 'traces':
			fadeOutTraces();
			break;
		default:
			console.log('unexpected value for wireframe toggle');
			break;
	}
});

socket.on('toggle-text', function(value){
	toggleText(value);
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

socket.on('bg-flip-reset', function(value){
	resetBackgroundFlip();
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

socket.on('comet-orbit-coeff', function(data){
	if(data.angle == 'phi')
		comet_orbit_coeff_phi = data.value;
	else
		comet_orbit_coeff_theta = data.value;
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

socket.on('toggle-spheredrop', function(data){
	toggleSpheredrop();
})

// -------------------------------------- TRACES
// -------------------------------------- TRACES
// -------------------------------------- TRACES
// -------------------------------------- TRACES

socket.on('traces-depth', function(data){
	traces_depth_coeff = data;
});

socket.on('traces-step', function(data){
	traces_oscill_step = data;
});

socket.on('traces-oscill', function(data){
	if(data.axis == 'x'){
		if(data.type == 'coeff')
			traces_oscill_coeff_x = data.value;
		else
			traces_oscill_speed_x = data.value;
	}else{
		if(data.type == 'coeff')
			traces_oscill_coeff_y = data.value;
		else
			traces_oscill_speed_y = data.value;
	}
});


socket.on('clear-color', function(value){
	clearColor(value);
});



// -------------------------------------- SPHERE
// -------------------------------------- SPHERE
// -------------------------------------- SPHERE
// -------------------------------------- SPHERE

socket.on('explosion-position', function(value){
	console.log('moving explosion');
	moveExplosionPosition();
});

socket.on('explosion-angle', function(value){
	if(value == 1)
		increaseAngle();
	if(value == -1)
		decreaseAngle();
});

socket.on('explosion-radius', function(value){
	if(value == 1)
		increaseExplosionRadius();
	if(value == -1)
		decraseExplosionRadius();
	if(value == 0)
		randomExplosionRadius();
});

socket.on('sphere-mode', function(mode){
	changeSphereMode(mode);
});

// -------------------------------------- CUBE
// -------------------------------------- CUBE
// -------------------------------------- CUBE
// -------------------------------------- CUBE

socket.on('cube-rotation', function(data){
	setCubeRotationSpeed(data.axis, data.value);
});

socket.on('cube-background-lines', function(data){
	setBackgroundCubeLines(data.property, data.value);
});

socket.on('cube-clap', function(data){
	toggleCubeClap();
});

socket.on('cube-invert', function(data){
	invertCube();
});

// -------------------------------------- NOISE
// -------------------------------------- NOISE
// -------------------------------------- NOISE
// -------------------------------------- NOISE

socket.on('noise-interval', function(data){
	updateNoiseInterval(data.property, parseFloat(data.value));
});

socket.on('noise-bloom', function(data){
	updateNoiseBloom(data.property, parseFloat(data.value));
});

socket.on('noise-tan', function(data){
	updateNoiseTan(data.property, parseFloat(data.value));
});

socket.on('noise-overlay', function(data){
	updateNoiseOverlay(data.property, parseFloat(data.value));
});
