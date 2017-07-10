// Define a general purpose 3D vector object for the mouse events.
function Vector3() {
  this.x = 0;
  this.y = 0;
  this.z = 0;
}
Vector3.prototype = {
  set : function(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
  },
};

function start_gl(canvas_id, vertexShader, fragmentShader) {
  var gl, canvas;
  // make sure the browser supports WebGL.
  try {
    canvas = document.getElementById(canvas_id);
    gl = canvas.getContext("webgl");
  } catch (e) {
    throw "Sorry, your browser does not support WebGL.";
  }

  // catch mouse events that go to the canvas.
  function setMouse(z) {
    var r = event.target.getBoundingClientRect();
    gl.cursor.x = (event.clientX - r.left  ) / (r.right - r.left) * 2 - 1;
    gl.cursor.y = (event.clientY - r.bottom) / (r.top - r.bottom) * 2 - 1;

    if (z !== undefined)
    gl.cursor.z = z;
  }
  canvas.onmousedown = function(event) { setMouse(1); }; // On mouse down, set z to 1.
  canvas.onmousemove = function(event) { setMouse() ; };
  canvas.onmouseup   = function(event) { setMouse(0); }; // On mouse up  , set z to 0.
  gl.cursor = new Vector3();

  // Initialize gl.
  gl_init(gl, vertexShader, fragmentShader);

  // Then start the frame loop
  gl_update(gl);
}

// Function to create and attach a shader to a gl program.

function addshader(gl, program, type, src) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS))
  throw "Cannot compile shader:\n\n" + gl.getShaderInfoLog(shader);
  gl.attachShader(program, shader);
}

// Initialize gl and create a square, given vertex and fragment shader defs.
var colorUniformLocation;

function gl_init(gl, vertexShader, fragmentShader) {

  // this is where i use the ajax utils to load the desired shaders
  var program = utils.addShaderProg(gl, vertexShader, fragmentShader);

  colorUniformLocation = gl.getUniformLocation(program, "uColor");
  var positionAttributeLocation = gl.getAttribLocation(program, "aPosition");

  // create a new buffer for position data
  var positionBuffer = gl.createBuffer();
  gl.useProgram(program);
  //turn on the attributes - that command tells webgl we want to supply data from a buffer
  gl.enableVertexAttribArray(positionAttributeLocation);
  // sets that as the buffer to be worked on
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(gl.aPosition, size, type, normalize, stride, offset);

  // THIS IS WHERE I DRAW A BACKGROUND
  var positions = [
    -1, 1, 0,
    1, 1, 0,
    -1, -1, 0,
    1, -1, 0
  ];

  //copies data into the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var count = 4;
  gl.uniform4f(colorUniformLocation, 1, 1, Math.random(), 1);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, count); //this is the actual draw call
  // DONE DRAWING BACKGROUND


  //reset vertex size for backgrounds
  size = 2;
  gl.vertexAttribPointer(gl.aPosition, size, type, normalize, stride, offset);


  //draw a bunch of rectangles
  for(var i = 0; i < 500; i++){
    setRect(gl, randomInt(0.3), randomInt(0.3), randomInt(0.3), randomInt(0.3));

    gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

    count = 6;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count); //this is the actual draw call
  }



  // Remember the address within the fragment shader of each of my uniform variables. that's because of fucking C code
  gl.uTime   = gl.getUniformLocation(program, "uTime"  );
  gl.uCursor = gl.getUniformLocation(program, "uCursor");
}

// Update is called once per animation frame.

function gl_update(gl) {
  // this is where i update the uTime variable and the uCursor variable
  gl.uniform1f(gl.uTime  , (new Date()).getTime() / 1000 - time0);
  gl.uniform3f(gl.uCursor, gl.cursor.x, gl.cursor.y, gl.cursor.z);

  for(var i = 0; i < 500; i++){
    setRect(gl, randomInt(0.3), randomInt(0.3), randomInt(0.3), randomInt(0.3));

    // gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

    count = 6;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, count); //this is the actual draw call
  }

  requestAnimFrame(function() { gl_update(gl); }); // Start the next frame.
}

// A browser-independent way to call a function after 1/60 second.

requestAnimFrame = (function(callback) {
  return requestAnimationFrame
  || webkitRequestAnimationFrame
  || mozRequestAnimationFrame
  || oRequestAnimationFrame
  || msRequestAnimationFrame
  || function(callback) { setTimeout(callback, 1000 / 60); };
})();

// Record the start time.
var time0 = (new Date()).getTime() / 1000;

function setRect(gl, x, y, w, h){
  var x1 = x;
  var x2 = x+w;
  var y1 = y;
  var y2 = y+h;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2]), gl.STATIC_DRAW);
  }

  function randomInt(range){
    var rand = ((Math.random()*2)-1)*range;
    return rand;
  }
