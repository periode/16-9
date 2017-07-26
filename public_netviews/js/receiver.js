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

socket.on('bg-color-toggle', function(value){
	bg_color_toggle = value;
});
