var stage, camera, renderer, controls;

var box;

function beginThree(){
	document.getElementsByTagName('iframe')[0].style.visibility = "hidden";
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
	
	initGeometry();
	initLights();
	render();
}

function initGeometry(){
	var geometry = new THREE.IcosahedronGeometry(20);

	for(var i = 0; i < geometry.faces.length; i++){
		geometry.faces[i].color.setHex(COLORS.hex_values[Math.floor(Math.random()*COLORS.hex_values.length)]);
	}
	
	var mat = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors});
	box = new THREE.Mesh(geometry, mat);
	box.rotation.y += 0.25;
	stage.add(box);
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
	renderer.render(stage, camera);
};

setTimeout(beginThree, 1000);
