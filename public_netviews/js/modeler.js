// import vsBuffer from "shaders/buffer.vs"
// import fsBuffer from "shaders/buffer.fs"

var stage, camera, renderer, controls, clock;

var background = [];
var box;
var geometry;

var traces = [];

// LIGHTS
var sun, point, ambient;

function begin(){
	// document.getElementsByTagName('iframe')[0].style.visibility = "hidden";
	stage = new THREE.Scene();
	stage.background = new THREE.Color('white');

	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1600);
	camera.position.z = 100;

	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	//controls.addEventListener('change', render); //remove when using animation loop
	controls.enableZoom = false;

	clock = new THREE.Clock(true);
	clock.start();

	initGeometry();
	initLights();
	onWindowResize();
 // 	getOriginalVertices();
	render();

	// animateGeometry();

}

var originalVertices = [];

function getOriginalVertices(){
	for(var i = 0; i < geometry.vertices.length; i++){
		originalVertices.push({x: geometry.vertices[i].x, y: geometry.vertices[i].y});
	}
}

function initGeometry(){

	//---------------------------- SHOW 1
	// initBackground();
 // 	initIsocahedron();
	initWorld();
	initTraces();


	//---------------------------- SHOW 2
	// initSphere();
}

function initIsocahedron(){
	geometry = new THREE.IcosahedronGeometry(10);

	for(var i = 0; i < geometry.faces.length; i++){
		geometry.faces[i].color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
	}

	var mat = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
	box = new THREE.Mesh(geometry, mat);
	box.rotation.y += 0.25;
	stage.add(box);
}

var spheredrop;

function initSpheredrop(){
	var geometry = new THREE.SphereGeometry(50, 32, 32);
	var material = new THREE.MeshBasicMaterial({color: 0x000000});
	spheredrop = new THREE.Mesh(geometry, material);
	spheredrop.position.z = -100;
	stage.add(spheredrop);
}

var world;

function initWorld(){
	let geom = new THREE.OctahedronGeometry(15);
	for(var i = 0; i < geom.faces.length; i++){
		geom.faces[i].color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
	}
	let material = new THREE.LineBasicMaterial({vertexColors: THREE.FaceColors, linewidth: 0.1});
	// material.wireframe = true;
	// material.linewidth = 1;
	world = new THREE.Mesh(geom, material);
	stage.add(world);
}

function initTraces(){

	var trace_num = Math.PI/(314/16);
	var trace_outer_rad = 200;
	var trace_inner_rad = 150;
	for(var i = 0; i < Math.PI*2; i+= trace_num){

		// var geometry = new THREE.Geometry();
		// geometry.vertices.push(
		// 	new THREE.Vector3( Math.cos(i)*trace_outer_rad, Math.sin(i)*trace_outer_rad, 0 ),
		// 	new THREE.Vector3( Math.cos(i)*trace_inner_rad, Math.sin(i)*trace_inner_rad, -100 )
		// );
		var mat = new THREE.MeshBasicMaterial({color: 0xffffff});
		mat.color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
		var path = new THREE.LineCurve(
			new THREE.Vector3( Math.cos(i)*trace_outer_rad, Math.sin(i)*trace_outer_rad, 0),
			new THREE.Vector3( Math.cos(i)*trace_inner_rad, Math.sin(i)*trace_inner_rad, -100)
		);
		var geometry = new THREE.TubeGeometry(path, 10, 2, 6, false);

		var trace = new THREE.Mesh(geometry, mat);
		traces.push(trace);
		stage.add(trace);
	}
}

function initSphere(){
	let count = 60000;
		let angles = new Float32Array(count * 1);
		let times = new Float32Array(count * 1);
		let speeds = new Float32Array(count * 1);
		let radii = new Float32Array(count * 1);
		let phi = new Float32Array(count * 1);
		let indexes = new Float32Array(count * 1);
		let theta = new Float32Array(count * 1);
		let face_positions = new Float32Array(count * 3);
		let positions = new Float32Array(count * 3);
		this.frictions = []

		let ang = 0;
		let triangle_size = 10;
		for(var i = 0; i < count; i+=3){ //go through the (count) vertices

			var speed = (Math.random() - 0.5)*0.5;
			var rad = 200 + Math.random()*0;
			var pos = (Math.random()-0.5)*1;

			var friction =  .1 + Math.random() * .2

			for(var j = 0; j < 3; j++){ //at each iteration, we loop three times for each of the vertices
				angles[i+j] = ang;
				times[i+j] = Math.random()*100;
				speeds[i+j] = speed;
				radii[i+j] = rad;
				indexes[i+j] = i

				theta[i+j] = 2.0
				phi[i+j] = 0.

				this.frictions.push( friction )

				face_positions[i+1] = pos;
				face_positions[i+2] = pos;
				face_positions[i+3] = pos;

				let k = (i+j)*3 //here, we need to have an offset in order to store x, y and z of each vertices

				positions[k] = pos + Math.random()* (triangle_size*1.5) //x
				positions[k+1] =  pos - Math.random()* triangle_size//y
				positions[k+2] =  pos + Math.random()* triangle_size//z
			}

			ang+=0.00001;
			// console.log(ang);
		}

		this.bufferGeom = new THREE.BufferGeometry()
		this.bufferGeom.addAttribute('aIndex', new THREE.BufferAttribute(indexes, 1))
		this.bufferGeom.addAttribute('aAngle', new THREE.BufferAttribute(angles, 1))
		this.bufferGeom.addAttribute('aTime', new THREE.BufferAttribute(times, 1))
		this.bufferGeom.addAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
		this.bufferGeom.addAttribute('aRadius', new THREE.BufferAttribute(radii, 1))
		this.bufferGeom.addAttribute('aTheta', new THREE.BufferAttribute(theta, 1))
		this.bufferGeom.addAttribute('aPhi', new THREE.BufferAttribute(phi, 1))
		this.bufferGeom.addAttribute('position', new THREE.BufferAttribute(positions, 3))
		this.bufferGeom.addAttribute('aFacePosition', new THREE.BufferAttribute(face_positions, 3))

		let bufferMat = new THREE.RawShaderMaterial({
			uniforms: {
				uTime: {type: 'f', value: 0},
				uPhiCoeff: {type: 'f', value: 2.0},
				uThetaCoeff: {type: 'f', value: 0.5},
				uExplosionRadius: {type: 'f', value: 100.},
				uExplosionPositionA: {type: 'v3', value: new THREE.Vector3(-200., 0., 0.)},
				uExplosionPositionB: {type: 'v3', value: new THREE.Vector3(200., 0., 0.)},
				uMode: {type: 'i', value: 1},
				uRadModifier: {type: 'f', value: 1}
			},
			vertexShader: vsTest,
			fragmentShader: fsTest,
			side: THREE.DoubleSide,
			transparent: true,
			depthWrite: false
		});

		this.bufferMesh = new THREE.Mesh(this.bufferGeom, bufferMat);
		this.stage.add(this.bufferMesh);
}

function clearColor(value){
	if(value == "black")
		stage.background.setHex(0x000000);

	if(value == "random")
		stage.background.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
}

function animateGeometry(){
	tweenGeometry();
}

function tweenGeometry(){
	var targetVertices = getTargetVertices();

	for(var i = 0; i < geometry.vertices.length; i++){
		tweenVertex(i, targetVertices);
	}
}

function tweenVertex(index, targetVertices){
	TweenLite.to(geometry.vertices[index], 1, {x: targetVertices[index].x, y: targetVertices[index].y, ease: Back.easeInOut, onComplete : function(){
		if(index === 0)
			tweenGeometry();
	}});
}

function getTargetVertices(){
	var tv = [];

	for(var i = 0; i < geometry.vertices.length; i++){
		tv[i] = {x: originalVertices[i].x - 5 + Math.random()*15, y: originalVertices[i].y - 5 + Math.random()*15};
	}

	return tv;
}

var bg_scale_x = 0;
var bg_scale_y = 0;
var bg_oscillation_coeff = 1;
var bg_flip_toggle = false;
var bg_color_toggle = false;
var bg_black = false;

function animateBackground(){
	var lfo = Math.cos(clock.getElapsedTime()*0.05);

	var current_flip = Math.floor(Math.random()*background.length);

	for(var i = 0; i < background.length; i++){
		if(bg_oscillation_coeff > 0)
			background[i].position.z = (Math.sin(i + clock.getElapsedTime()*5) * 30)*lfo * bg_oscillation_coeff;
		if(bg_scale_x > 0)
			background[i].scale.x = (Math.cos(i + clock.getElapsedTime()*2) * 10)*lfo * bg_scale_x;
		if(bg_scale_y > 0)
			background[i].scale.y = (Math.sin(i + clock.getElapsedTime()*2) * 10)*lfo * bg_scale_y;
		if(bg_flip_toggle){
			TweenLite.to(background[current_flip].rotation, 1, {x: 0, y: background[current_flip].rotation.y + Math.PI, ease: Back.easeInOut});
		}
	}
}

function toggleBgWireframe(){
	for(var i = 0; i < background.length; i++){
		background[i].material.wireframe = !background[i].material.wireframe;
	}
}

var world_is_rotating = true;

function animateWorld(){
	if(world_is_rotating == true){
		TweenLite.to(world.rotation, 0.5, {x: Math.floor(Math.random()*8)/4*Math.PI, y: Math.floor(Math.random()*8)/4*Math.PI, ease: Power3.easeInOut});
		world_is_rotating = false;
		setTimeout(function(){world_is_rotating = true}, 2000);
	}
}

var iso_rotation_coeff = 1;
var iso_gravitation_coeff = 40;
var iso_gravitation_speed = 2;

function animateIsocahedron(){
	box.rotation.x += 0.025 * iso_rotation_coeff;
	box.rotation.y += 0.01 * iso_rotation_coeff;

	if(iso_gravitation_coeff > 0){
		for(var u = 0; u < 1; u += 0.01){
			for(var v = 0; v < 1; v += 0.01){
				var theta = 2 * Math.PI * u + clock.getElapsedTime() * iso_gravitation_speed;
				var phi = Math.PI * v + clock.getElapsedTime() * iso_gravitation_speed;
				box.position.x = Math.sin(theta) * Math.cos(phi) * iso_gravitation_coeff;
				box.position.y = Math.sin(phi) * iso_gravitation_coeff;
				box.position.z = Math.cos(phi) * Math.cos(theta) * iso_gravitation_coeff;
			}
		}

	}

	geometry.verticesNeedUpdate = true;
}



// CONTROLS
var traces_oscill_speed_x = 0.8;
var traces_oscill_coeff_x = 0.1;
var traces_oscill_speed_z = 3.0;
var traces_oscill_coeff_z= 0.1;

function animateTraces(){
	for(var i = 0; i < traces.length; i++){
		var inc_x = Math.sin(i*0.1+clock.getElapsedTime()*traces_oscill_speed_x)*traces_oscill_coeff_x;
		var inc_y = Math.cos(i*0.1+clock.getElapsedTime()*traces_oscill_speed_z)*traces_oscill_coeff_z;

		traces[i].scale.x += inc_x;
		traces[i].scale.y += inc_x;
		traces[i].scale.z += inc_y;

		// THIS IS FOR LINES
		// traces[i].geometry.vertices[traces[i].geometry.vertices.length-1].x += inc_x;
		// traces[i].geometry.vertices[traces[i].geometry.vertices.length-1].z += inc_y;
		// traces[i].geometry.verticesNeedUpdate = true;
	}


}


function paintTraces(){
	var start_index = Math.floor(Math.random()*traces.length-100);
	var paint_width = Math.floor(Math.random()*100);
	var color = COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)];
	for(var i = start_index; i < paint_width; i++){
		traces[i].material.color.setHex(color);
	}

	// setTimeout(paintTraces, 1000);
}

// ===========================
// =========================== INIT BACKGROUND
// ===========================

var background_radius = 60;

function initBackground(){

	for(var z = 0; z < Math.PI*2; z += 0.1){ //make a circle
			var geom = new THREE.PlaneGeometry(5, 10);

			var mat = new THREE.MeshBasicMaterial();
			// mat.wireframe = true;
			mat.color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
			var mesh = new THREE.Mesh(geom, mat);
			mesh.wireframe = true;
			mesh.position.y = Math.cos(z) * background_radius;
			mesh.position.x = Math.sin(z) * background_radius;

			mesh.lookAt(new THREE.Vector3(0, 0, 0));
			background.push(mesh);
			stage.add(mesh);
	}
}

var backdrop;

function initBackdrop(){
	var mat = new THREE.MeshBasicMaterial();


	var geom = new THREE.BoxGeometry(window.innerWidth*2, window.innerHeight*2, 1, 2, 2, 2);
	backdrop = new THREE.Mesh(geom, mat);
	backdrop.position.z = -200;
	stage.add(backdrop);
}

function initLights(){
	point = new THREE.PointLight(0xffffff);
	point.position.set(100, 100, -25);
	stage.add(point);

	sun = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	sun.position.set(100, 100, 50);
	stage.add(sun);

	ambient = new THREE.AmbientLight(0xffffff);
	stage.add(ambient);
}

function onWindowResize(){
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

var render = function(){
	requestAnimationFrame(render);

	// animateIsocahedron();
	animateBackground();
	animateWorld();
	animateTraces();

	renderer.render(stage, camera);
};


function loadShader(file, type, variable){
	$.ajax({
			async: true,
			url: "js/shaders/" + file + "." + type, //todo: use global config for shaders folder?
			dataType: "text",
			success: function(result) {
				console.log("succesfully loaded shader file: "+file+"."+type);
				if(type == 'vs')
					vsTest = result;
				if(type == 'fs')
					fsTest = result;
			},
			fail: function(){
				console.log("unable to load shader file: "+file+"."+type);
				// return null;
			}
	});
}

setTimeout(begin, 1000);

var fsTest, vsTest;

vsTest = "lol";

function fetch(){
	loadShader('buffer', 'vs');
	loadShader('buffer', 'fs');
}
