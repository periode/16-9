const SOCKET_SERVER_URL = "104.236.239.60:4783";
const SOCKET_LOCALHOST = "localhost:4783";

const socket = io(SOCKET_SERVER_URL);

socket.on('connect', function(){
	console.log('socket connection established to', SOCKET_SERVER_URL);
});

function startAll(){
	socket.emit('conductor-start');
}

function setShow(index){
	socket.emit('set-show', index);
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

function remove(actor){
	socket.emit('remove-actor', actor);
}

function toggle(actor){
	socket.emit('toggle', actor);
}

function toggleText(actor){
	socket.emit('toggle-text', actor);
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
	document.getElementById('label_bgscalex').innerText = val;
	socket.emit('bg-scale-x', val);
}

function updateBgScaleY(val){
	document.getElementById('label_bgscaley').innerText = val;
	socket.emit('bg-scale-y', val);
}

function updateBgOscillCoeff(val){
	document.getElementById('label_bgoscill').innerText = val;
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
	document.getElementById('label_cometrot').innerText = value;
	socket.emit('comet-rotation', parseFloat(value));
}

function startCometDistort(){
	socket.emit('comet-distort-start', 1);
}

function updateCometDistortCoeff(value){
	document.getElementById('label_cometdistort').innerText = value;
	socket.emit('comet-distort-coeff', parseFloat(value));
}

function updateCometGravitationCoeff(value){
	document.getElementById('label_cometgravcoeff').innerText = value;
	socket.emit('comet-gravitation-coeff', parseFloat(value));
}

function updateCometGravitationSpeed(value){
	document.getElementById('label_cometgravspeed').innerText = value;
	socket.emit('comet-gravitation-speed', parseFloat(value));
}

function updateCometOrbitCoeff(_angle, _value){
	if(_angle == 'phi')document.getElementById('label_cometorbitcoeff').innerText = _value;
	if(_angle == 'theta')document.getElementById('label_cometorbitspeed').innerText = _value;
	socket.emit('comet-orbit-coeff', {angle:_angle, value:parseFloat(_value)});
}

// -------------------------------------- WORLD
// -------------------------------------- WORLD
// -------------------------------------- WORLD
// -------------------------------------- WORLD

function updateWorldRotation(_axis, _value){
	if(_axis == 'x')document.getElementById('label_worldx').innerText = _value;
	if(_axis == 'y')document.getElementById('label_worldy').innerText = _value;
	if(_axis == 'z')document.getElementById('label_worldz').innerText = _value;
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
	if(_axis == 'x' && _type == 'speed')document.getElementById('label_tracesoscillxspeed').innerText = _value;
	if(_axis == 'y'  && _type == 'speed')document.getElementById('label_tracesoscillyspeed').innerText = _value;
	if(_axis == 'x' && _type == 'coeff')document.getElementById('label_tracesoscillxcoeff').innerText = _value;
	if(_axis == 'y'  && _type == 'coeff')document.getElementById('label_tracesoscillycoeff').innerText = _value;
	socket.emit('traces-oscill', {axis: _axis, type: _type, value:_value});
}

function updateTracesDepth(value){
	socket.emit('traces-depth', value);
}

function updateTracesStep(value){
	socket.emit('traces-step', value);
}

// -------------------------------------- SPHERE
// -------------------------------------- SPHERE
// -------------------------------------- SPHERE
// -------------------------------------- SPHERE

function moveExplosionPosition(){
	socket.emit('explosion-position', 1);
}

function changeExplosionRadius(value){
	socket.emit('explosion-radius', value);
}

function changeAngleStep(direction){
	socket.emit('explosion-angle', direction);
}

function changeSphereMode(mode){
	socket.emit('sphere-mode', mode);
}

// -------------------------------------- CUBE
// -------------------------------------- CUBE
// -------------------------------------- CUBE
// -------------------------------------- CUBE

function updateCubeRotation(axis, value){
	if(axis == 'x')document.getElementById('label_cuberotx').innerText = value;
	if(axis == 'y')document.getElementById('label_cuberoty').innerText = value;
	if(axis == 'z')document.getElementById('label_cuberotz').innerText = value;
	socket.emit('cube-rotation', {axis: axis, value: value});
}
function updateBackgroundCubeLines(property, value){
	if(property == 'down')document.getElementById('label_cubedown').innerText = value;
	if(property == 'interval')document.getElementById('label_cubeinterval').innerText = value;
	socket.emit('cube-background-lines', {property: property, value: value});
}
function toggleCubeClap(){
	socket.emit('cube-clap', 1);
}
function invertCube(){
	socket.emit('cube-invert', 1);
}

// -------------------------------------- NOISE
// -------------------------------------- NOISE
// -------------------------------------- NOISE
// -------------------------------------- NOISE

function updateNoiseInterval(property, value){
	if(property == 'vertinterval')document.getElementById('label_noisevertinterval').innerText = value;
	if(property == 'vertspeed')document.getElementById('label_noisevertspeed').innerText = value;
	if(property == 'coeff')document.getElementById('label_noiseintervalcoeff').innerText = value;
	if(property == 'modulo')document.getElementById('label_noiseintervalmodulo').innerText = value;
	if(property == 'speed')document.getElementById('label_noiseintervalspeed').innerText = value;
	socket.emit('noise-interval', {property: property, value: value});
}
function updateNoiseBloom(property, value){
	if(property == 'speed')document.getElementById('label_noisebloomspeed').innerText = value;
	if(property == 'intensity')document.getElementById('label_noisebloomintensity').innerText = value;
	socket.emit('noise-bloom', {property: property, value: value});
}
function updateNoiseTan(property, value){
	if(property == 'size')document.getElementById('label_noisetansize').innerText = value;
	if(property == 'modulo')document.getElementById('label_noisetanmodulo').innerText = value;
	socket.emit('noise-tan', {property: property, value: value});
}
function updateNoiseOverlay(property, value){
	if(property == 'distance')document.getElementById('label_noisedistance').innerText = value;
	if(property == 'size')document.getElementById('label_noisesize').innerText = value;
	if(property == 'speed')document.getElementById('label_noisespeed').innerText = value;
	if(property == 'impact')document.getElementById('label_noiseimpact').innerText = value;
	socket.emit('noise-overlay', {property: property, value: value});
}
