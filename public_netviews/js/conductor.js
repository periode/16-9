const SOCKET_SERVER_URL = "104.236.239.60:4783";
const SOCKET_LOCALHOST = "localhost:4783";

const socket = io(SOCKET_LOCALHOST);

socket.on('connect', function(){
	console.log('socket connection established to', SOCKET_SERVER_URL);
});

function startAll(){
	socket.emit('conductor-start');
}

function toggleWireframe(actor){
	socket.emit('wireframe-toggle', actor);
}

function setClearcolor(value){
	socket.emit('clear-color', value);
}

function introduce(actor){
	socket.emit('introduce', actor);
}

function toggle(actor){
	socket.emit('toggle', actor);
}

function fadeOut(actor){
	socket.emit('fade-out', actor);
}

function fadeIn(actor){
	socket.emit('fade-in', actor);
}

// -------------------------------------- BACKGROUND
// -------------------------------------- BACKGROUND
// -------------------------------------- BACKGROUND
// -------------------------------------- BACKGROUND

function updateBgScaleX(val){
	socket.emit('bg-scale-x', val);
}

function updateBgScaleY(val){
	socket.emit('bg-scale-y', val);
}

function updateBgOscillCoeff(val){
	socket.emit('bg-oscill-coeff', val);
}

var bg_flip_toggle = false;

function toggleBgFlip(){
	bg_flip_toggle = !bg_flip_toggle;

	socket.emit('bg-flip-toggle', bg_flip_toggle);
}

function resetBackgroundFlip(){
	socket.emit('bg-flip-reset', 1);
}

// -------------------------------------- COMET
// -------------------------------------- COMET
// -------------------------------------- COMET
// -------------------------------------- COMET

function updateCometRotation(value){
	socket.emit('comet-rotation', value);
}

function startCometDistort(){
	socket.emit('comet-distort-start', 1);
}

function updateCometDistortCoeff(value){
	socket.emit('comet-distort-coeff', value);
}

function updateCometGravitationCoeff(value){
	socket.emit('comet-gravitation-coeff', value);
}

function updateCometGravitationSpeed(value){
	socket.emit('comet-gravitation-speed', value);
}

function updateCometOrbitCoeff(_angle, _value){
	socket.emit('comet-orbit-coeff', {angle:_angle, value:_value});
}

// -------------------------------------- WORLD
// -------------------------------------- WORLD
// -------------------------------------- WORLD
// -------------------------------------- WORLD

function updateWorldRotation(_axis, _value){
	socket.emit('world-rotation', {axis:_axis, value:_value});
}

function switchWorldGeometry(value){
	socket.emit('world-geometry', value);
}

function toggleSpheredrop(){
	socket.emit('toggle-spheredrop', 1);
}

// -------------------------------------- TRACES
// -------------------------------------- TRACES
// -------------------------------------- TRACES
// -------------------------------------- TRACES

function updateTracesOscill(_axis, _type, _value){
	socket.emit('traces-oscill', {axis: _axis, type: _type, value:_value});
}

function updateTracesDepth(value){
	socket.emit('traces-depth', value);
}

function updateTracesStep(value){
	socket.emit('traces-step', value);
}
