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

function begin(){
	beginThree();
}
