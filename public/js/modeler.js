var stage, camera, renderer, controls, clock;

var background = [];
var box;
var geometry;

function beginThree(){
	// document.getElementsByTagName('iframe')[0].style.visibility = "hidden";
	stage = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
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
	animateBackground();
	tweenGeometry();
}

var originalVertices = [];

function getOriginalVertices(){
	for(var i = 0; i < geometry.vertices.length; i++){
		originalVertices.push({x: geometry.vertices[i].x, y: geometry.vertices[i].y});
	}
}

function initGeometry(){
	initBackground();

	geometry = new THREE.IcosahedronGeometry(20);

	for(var i = 0; i < geometry.faces.length; i++){
		geometry.faces[i].color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
	}

	var mat = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
	box = new THREE.Mesh(geometry, mat);
	box.rotation.y += 0.25;
	stage.add(box);
}

function tweenGeometry(){
	var targetVertices = getTargetVertices();

	for(var i = 0; i < geometry.vertices.length; i++){
		tweenVertex(i, targetVertices);
	}
}

function tweenVertex(index, targetVertices){
	// console.log('comparing', geometry.vertices[index].x, targetVertices[index].x);
	TweenLite.to(geometry.vertices[index], 1, {x: targetVertices[index].x, y: targetVertices[index].y, ease: Back.easeInOut, onComplete : function(){
		if(index === 0)
			tweenGeometry();
	}});
}

function getTargetVertices(){
	var tv = [];

	for(var i = 0; i < geometry.vertices.length; i++){
		tv[i] = {x: originalVertices[i].x - 5 + Math.random()*10, y: originalVertices[i].y - 5 + Math.random()*10};
	}

	return tv;
}

function animateBackground(){
	for(var i = 0; i < background.length; i++){
		background[i].position.y = Math.sin(i + clock.getElapsedTime()*10) * 10;
	}
}

// ===========================
// =========================== INIT BACKGROUND
// ===========================
function initBackground(){

	for(var z = 0; z < 6.28; z += 0.1){ //make a circle
			var geom = new THREE.PlaneGeometry(5, 10);
			// var m = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('data/img/background_large.jpg')});
			var mat = new THREE.MeshBasicMaterial();
			mat.color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
			var mesh = new THREE.Mesh(geom, mat);

			mesh.position.z = Math.cos(z) * 100;
			mesh.position.x = Math.sin(z) * 100;

			mesh.lookAt(new THREE.Vector3(0, 0, 0));
			background.push(mesh);
			stage.add(mesh);
	}

}

function initLights(){
	var light = new THREE.PointLight(0xffffff);
	light.position.set(100, 100, -25);
	stage.add(light);

	var sun = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	sun.position.set(100, 100, 50);
	stage.add(sun);

	var ambient = new THREE.AmbientLight(0xffffff);
	stage.add(ambient);
}

function onWindowResize(){
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

var render = function(){
	requestAnimationFrame(render);
	box.rotation.x += 0.05;
	animateBackground();
	renderer.render(stage, camera);
	geometry.verticesNeedUpdate = true;

};

// var d = new Date();
// var start_time = d.getMilliseconds();
// function millis(){
// 	var date = new Date();
// 	return date.getMilliseconds() - start_time;
// }

setTimeout(beginThree, 1000);
