const DEV = false;
var IS_PLAYING = false;


var rows = 9;
var columns = 16;
var vertices = [];

// IMAGES
var esh;


function init(){
	if(DEV){
		console.log('======= DEV MODE ========');
		console.log(COLORS);
		IS_PLAYING = true;
	}
}

function preload(){
	esh = loadImage('data/img/esh.jpg');
}

function setup(){
	var i = document.getElementsByTagName("iframe")[0];
	i.style.visibility = "hidden";

	var cnv = createCanvas(windowWidth, windowHeight);

	esh.resize(width, 0);
	
	xstep = width/columns;
	ystep = height/rows;

	for(var x = 0.5; x < columns; x++){
		for(var y = 0.5; y < rows; y++){
			var v = createVector(x*xstep, y*ystep);
			vertices.push(v);
		}
	}
}


function draw(){
	background(0, 0, 0);
	fill(255, 255, 255);
	noStroke()
	for(var i = 0; i < vertices.length; i++){
		ellipse(vertices[i].x, vertices[i].y, 4, 4);
	}

	if(IS_PLAYING){

		esh.loadPixels();
		for(var x = 0; x < esh.width; x++){
			for(var y = 0; y < esh.height; y++){
				esh.set(x, y, color(esh.get(y, x)[1], esh.get(x, y)[0], 255, 255));
			}
		}
		esh.updatePixels();
		
		image(esh, 0, 0);
	}
}


function toggleLiveStream(){
	var i = document.getElementsByTagName("iframe")[0];
	var b = document.getElementsByTagName("button")[0];

	if(i.style.visibility == "hidden"){
		b.innerText = "hide stream";
		i.style.visibility = "visible";
	}else{
		b.innerText = "show stream";
		i.style.visibility = "hidden";
	}

}

function toggleFullScreen(){
	var fs = fullscreen();
    	fullscreen(!fs);
}
