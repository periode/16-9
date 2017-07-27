// import vsBuffer from "shaders/buffer.vs"
// import fsBuffer from "shaders/buffer.fs"

var stage, camera, renderer, controls, clock;

var background = [];
var comet, backdrop, world, spheredrop;
var geometry;

var traces = [];

// LIGHTS
var sun, point, ambient;

function begin(){
	// document.getElementsByTagName('iframe')[0].style.visibility = "hidden";
	stage = new THREE.Scene();
	stage.background = new THREE.Color('black');

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
 	getOriginalVertices();
	render();

}

var originalVertices = [];

function getOriginalVertices(){
	for(var i = 0; i < comet.geometry.vertices.length; i++){
		originalVertices.push({x: geometry.vertices[i].x, y: geometry.vertices[i].y});
	}
}

function initGeometry(){

	//---------------------------- SHOW 1
	initBackground();
 	initComet();
	initWorld();
	initTraces();


	//---------------------------- SHOW 2
	// initSphere();
}

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
	}
}

function introduceBackground(){
	for(var i = 0; i < background.length; i++){
		stage.add(background[i]);
	}
}

function toggleBackground(){
	for(var i = 0; i < background.length; i++){
		background[i].material.visible = !background[i].material.visible;
	}
}

function toggleBgWireframe(){
	for(var i = 0; i < background.length; i++){
		background[i].material.wireframe = !background[i].material.wireframe;
	}
}

function initComet(){
	geometry = new THREE.IcosahedronGeometry(10);

	for(var i = 0; i < geometry.faces.length; i++){
		geometry.faces[i].color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
	}

	var mat = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
	comet = new THREE.Mesh(geometry, mat);
	comet.scale.x = 0.1;
	comet.scale.y = 0.1;
	comet.scale.z = 0.1;

}

function introduceComet(){
	stage.add(comet);
	TweenLite.to(comet.scale, 6, {x:1, y:1, z:1, ease: Power2.easeOut});
}

function toggleComet(){
	comet.material.visible = !comet.material.visible;
}

function toggleCometWireframe(){
	comet.material.wireframe = !comet.material.wireframe;
}

function initSpheredrop(){
	var geometry = new THREE.SphereGeometry(50, 32, 32);
	var material = new THREE.MeshBasicMaterial({color: 0x000000});
	spheredrop = new THREE.Mesh(geometry, material);
	spheredrop.position.z = -100;
	stage.add(spheredrop);
}

function initWorld(){
	let geom = new THREE.OctahedronGeometry(15);
	for(var i = 0; i < geom.faces.length; i++){
		geom.faces[i].color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
	}
	let material = new THREE.LineBasicMaterial({vertexColors: THREE.FaceColors});
	material.wireframe = true;
	world = new THREE.Mesh(geom, material);
	world.scale.x = 0.01;
	world.scale.y = 0.01;
	world.scale.z = 0.01;
	stage.add(world);
}

function introduceWorld(){
	stage.add(world);
	TweenLite.to(world.scale, 4, {x:1, y:1, z:1, ease: Power2.easeOut});
}

function toggleWorld(){
	world.material.visible = !world.material.visible;
}

function toggleWorldWireframe(){
	world.material.wireframe = !world.material.wireframe;
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
	}
}

function introduceTraces(){
	for(var i = 0; i < traces.length; i++){
		stage.add(traces[i]);
	}
}

function toggleTraces(){
	for(var i = 0; i < traces.length; i++){
		traces[i].material.visible = !traces[i].material.visible;
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

function initBackdrop(){
	var mat = new THREE.MeshBasicMaterial();


	var geom = new THREE.BoxGeometry(window.innerWidth*2, window.innerHeight*2, 1, 2, 2, 2);
	backdrop = new THREE.Mesh(geom, mat);
	backdrop.position.z = -200;
	stage.add(backdrop);
}

function clearColor(value){
	if(value == "black")
		stage.background.setHex(0x000000);

	if(value == "random")
		stage.background.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
}

var bg_scale_x = 0.01;
var bg_scale_y = 0.01;
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

// -------------------------------------- WORLD
// -------------------------------------- WORLD
// -------------------------------------- WORLD
// -------------------------------------- WORLD

var world_is_rotating = true;
var world_rotation_x_coeff = 0;
var world_rotation_y_coeff = 0;
var world_rotation_z_coeff = 0;

function animateWorld(){
	if(world_is_rotating == true){
		TweenLite.to(world.rotation, 0.5, {x: Math.floor(Math.random()*world_rotation_x_coeff)/4*Math.PI, y: Math.floor(Math.random()*world_rotation_y_coeff)/4*Math.PI, z: Math.floor(Math.random()*world_rotation_z_coeff)/4*Math.PI, ease: Power3.easeInOut});
		world_is_rotating = false;
		setTimeout(function(){world_is_rotating = true}, 2000);
	}
}

function switchWorldGeometry(){
	var is_wireframe = world.material.wireframe;
	var rand = Math.floor(Math.random()*4);
	var new_geom;

	switch(rand){
		case 0:
			new_geom = new THREE.DodecahedronGeometry(15);
			break;
		case 1:
			new_geom = new THREE.OctahedronGeometry(15);
			break;
		case 2:
			new_geom = new THREE.TetrahedronGeometry(15);
			break;
		case 3:
			new_geom = new THREE.TorusGeometry(15, 5, 4, 4);
			break;
		default:
			console.log("error switching world geometry");
			break;
	}

	for(var i = 0; i < new_geom.faces.length; i++){
		new_geom.faces[i].color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
	}
	let mat = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
	mat.wireframe = is_wireframe;
	world.geometry = new_geom;
	world.material = mat
}
// -------------------------------------- COMET
// -------------------------------------- COMET
// -------------------------------------- COMET
// -------------------------------------- COMET

var comet_rotation_coeff = 0;
var comet_gravitation_coeff = 0;
var comet_gravitation_speed = 0;

function animateComet(){
	comet.rotation.x += 0.025 * comet_rotation_coeff;
	comet.rotation.y += 0.01 * comet_rotation_coeff;

	if(comet_gravitation_coeff >= 0){
		for(var u = 0; u < 1; u += 0.01){
			for(var v = 0; v < 1; v += 0.01){
				var theta = 2 * Math.PI * u + clock.getElapsedTime() * comet_gravitation_speed;
				var phi = Math.PI * v + clock.getElapsedTime() * comet_gravitation_speed;
				comet.position.x = Math.sin(theta) * Math.cos(phi) * comet_gravitation_coeff;
				comet.position.y = Math.sin(phi) * comet_gravitation_coeff;
				comet.position.z = Math.cos(phi) * Math.cos(theta) * comet_gravitation_coeff;
			}
		}

	}

	comet.geometry.verticesNeedUpdate = true;

}

function tweenComet(){
	var targetVertices = getTargetVertices();

	for(var i = 0; i < comet.geometry.vertices.length; i++){
		tweenVertex(i, targetVertices);
	}
}

function tweenVertex(index, targetVertices){
	TweenLite.to(comet.geometry.vertices[index], 1, {x: targetVertices[index].x, y: targetVertices[index].y, ease: Back.easeInOut, onComplete : function(){
		if(index === 0)
			tweenComet();
	}});
}

var comet_distort_coeff = 0;

function getTargetVertices(){
	var tv = [];

	for(var i = 0; i < comet.geometry.vertices.length; i++){
		tv[i] = {x: originalVertices[i].x - comet_distort_coeff*0.3 + Math.random()*comet_distort_coeff, y: originalVertices[i].y - comet_distort_coeff*0.3 + Math.random()*comet_distort_coeff};
	}

	return tv;
}


// -------------------------------------- TRACES
// -------------------------------------- TRACES
// -------------------------------------- TRACES
// -------------------------------------- TRACES
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

	animateComet();
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
