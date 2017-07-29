
// -------------------------------------- SPHERE
// -------------------------------------- SPHERE
// -------------------------------------- SPHERE
// -------------------------------------- SPHERE

var sphere_phi_coeff_target = 0;
var sphere_phi_coeff = 0;
var sphere_theta_coeff_target = 0;
var sphere_theta_coeff = 0;

var sphere_explosion_pos_a = [-200, 0, 0];
var sphere_explosion_pos_a_target = [-200, 0, 0];
var sphere_explosion_pos_b = [200, 0, 0];
var sphere_explosion_pos_b_target = [200, 0, 0];
var sphere_explosion_rad = 0;
var sphere_explosion_rad_target = 0;

var sphere_theta = 0
var sphere_phi = 0
var sphere_radius = 150

// -------------------------------------- CUBE
// -------------------------------------- CUBE
// -------------------------------------- CUBE
// -------------------------------------- CUBE
var cube, cubeBackground;

var cube_step = 0;
var cube_step_thresh = 1;
var cube_invert = false;
var cube_offset = 0;
var cube_offset_thresh = 0;
var cube_clap = false;


// -------------------------------------- NOISE
// -------------------------------------- NOISE
// -------------------------------------- NOISE
// -------------------------------------- NOISE

var noise;

function initShaders(){
  initSphere();
  initCube();
  initNoise();
}

function animateShader(){
  if(stage.getObjectById(sphere.id) != null)
    animateSphere();

  if(stage.getObjectById(cube.id) != null)
    animateCube();

  if(stage.getObjectById(noise.id) != null)
    animateNoise();
}

var fsSphere, vsSphere;
var fsCubeBackground, vsCubeBackground;
var fsCube, vsCube;

function loadAllShaders(){
	loadShader('sphere', 'vs');
	loadShader('sphere', 'fs');
  loadShader('cubeBackground', 'vs');
	loadShader('cubeBackground', 'fs');
  loadShader('cube', 'vs');
	loadShader('cube', 'fs');
  loadShader('noise', 'vs');
	loadShader('noise', 'fs');
}

function loadShader(file, type, variable){
	$.ajax({
			async: true,
			url: "js/shaders/" + file + "." + type, //todo: use global config for shaders folder?
			dataType: "text",
			success: function(result) {
				console.log("succesfully loaded shader file: "+file+"."+type);
				if(type == 'vs'){
          if(file == 'sphere')
            vsSphere = result;
          if(file == 'cubeBackground')
            vsCubeBackground = result;
          if(file == 'cube')
            vsCube = result;
          if(file == 'noise')
            vsNoise = result;
        }

				if(type == 'fs'){
          if(file == 'sphere')
            fsSphere = result;
          if(file == 'cubeBackground')
            fsCubeBackground = result;
          if(file == 'cube')
            fsCube = result;
          if(file == 'noise')
            fsNoise = result;
        }
			},
			fail: function(){
				console.log("unable to load shader file: "+file+"."+type);
				// return null;
			}
	});
}


// ==================================================================== INIT
// ==================================================================== INIT
// ==================================================================== INIT
// ==================================================================== INIT

function initNoise(){
  var noiseGeometry = new THREE.PlaneGeometry(1200, 800, 1);
  var noiseMat = new THREE.RawShaderMaterial({
    uniforms: {
      uTime:{type: 'f', value: 0.0},
      uVerticalInterval:{type: 'f', value: 50.0},
      uVerticalSpeed:{type: 'f', value: 0.01},
      uIntervalCoeff:{type: 'f', value: 0},
      uIntervalModulo:{type: 'f', value: 100.0},
      uIntervalSpeed:{type: 'f', value: 20.0},
      uBloomSpeed:{type: 'f', value: 0.001},
      uBloomIntensity:{type: 'f', value: 0.00001},
      uTanSquaresSize:{type: 'f', value: 0.1},
      uTanSquareModulo:{type: 'f', value: 20.},
      uNoiseDist:{type: 'f', value: 6.0},
      uNoiseSize:{type: 'f', value: 0.005},
      uNoiseSpeed:{type: 'f', value: 0.0001},
      uNoiseImpact:{type: 'f', value: 1}
    },
    vertexShader: vsNoise,
    fragmentShader: fsNoise
  });

  noise = new THREE.Mesh(noiseGeometry, noiseMat);
  noise.position = -120;
}

function introduceNoise(){
  stage.add(noise);

  if(stage.getObjectById(cube.id) != null)
    stage.remove(cube);
  if(stage.getObjectById(cubeBackground.id) != null)
    stage.remove(cubeBackground);
  if(stage.getObjectById(sphere.id) != null)
    stage.remove(sphere);
}

function introduceSphere(){
  stage.add(sphere);

  if(stage.getObjectById(cube.id) != null)
    stage.remove(cube);
  if(stage.getObjectById(cubeBackground.id) != null)
    stage.remove(cubeBackground);
  if(stage.getObjectById(noise.id) != null)
    stage.remove(noise);
}

function introduceCube(){
  stage.add(cube);
  stage.add(cubeBackground);

  if(stage.getObjectById(sphere.id) != null)
    stage.remove(sphere);
  if(stage.getObjectById(noise.id) != null)
    stage.remove(noise);
}

function initCube(){
  var cubeGeometry = new THREE.BoxGeometry(100,100,100);
  var cubeMaterial = new THREE.RawShaderMaterial( {
    uniforms: {
      uColor: { type: "c", value: new THREE.Color( 0xffff00 ) },
      uTime: { value: 0},
      uStep: { type: 'f', value: 0},
      uInvert: {value: false}
    },
    vertexShader: vsCube,
    fragmentShader: fsCube
  } );

  var backgroundCubeGeometry = new THREE.PlaneGeometry(1200, 800, 1)
  var backgroundCubeMat = new THREE.RawShaderMaterial( {
    uniforms: {
      uColor: { type: "c", value: new THREE.Color( 0x00ff00 ) },
      uTime: { value: 0},
      uStep: { type: 'f', value: 0},
      uInvert: {value: false},
      uOffset: {value: 0},
      uClap: {value: false},
      uSpeedDown: {value: 0},
      uSpeedInterval: {value: 0}
    },
    vertexShader: vsCubeBackground,
    fragmentShader: fsCubeBackground
  } );

  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.z = -120;
  cubeBackground = new THREE.Mesh(backgroundCubeGeometry, backgroundCubeMat);
  cubeBackground.position.z = -250;
  cubeBackground.lookAt(new THREE.Vector3(0, 0, 0));

  cube_theta = 0
  cube_phi = 0
}

var cube_rot_x = 0.00005;
var cube_rot_y = 0.02;
var cube_rot_z = 0;

var cube_rot = new THREE.Vector3(0.00005, 0.02, 0);
function animateCube(){
  cube_time += clock.getElapsedTime();
  cube.rotation.x += cube_rot.x;
  cube.rotation.y += cube_rot.y;
  cube.rotation.z += cube_rot.z;

  cubeBackground.material.uniforms.uTime.value = cube_time;
  cube.material.uniforms.uTime.value = cube_time;

  cube_step += (cube_step_thresh - cube_step) * .1
  cubeBackground.material.uniforms.uStep.value = cube_step;
  cube.material.uniforms.uStep.value = cube_step;

  cube_offset = (cube_offset_thresh - cube_offset) * .01
  cubeBackground.material.uniforms.uOffset.value = cube_offset_thresh;

  cube_theta += .01
  cube_phi += .05

  // console.log('pos',cube.position);
}

function setCubeRotationSpeed(axis, value){
  var v = parseFloat(value);
  if(axis == 'x')
    cube_rot.x = v;
  if(axis == 'y')
    cube_rot.y = v;
  if(axis == 'z')
    cube_rot.z = v;
  if(axis == 'r')
    cubeResetPosition();
}

function cubeResetPosition(){
  TweenLite.to(cube.rotation, 3, {x: 0, y: 0, z: 0, ease:Back.easeInOut});
  cube_rot = new THREE.Vector3(0, 0, 0);
}

function setBackgroundCubeLines(property, value){
  if(property == 'down')
    cubeBackground.material.uniforms.uSpeedDown.value = value;
  if(property == 'interval')
    cubeBackground.material.uniforms.uSpeedInterval.value = value;
}

function invertCube(){
  cube_invert = !cube_invert;
  cubeBackground.material.uniforms.uInvert.value = cube_invert;
  cube.material.uniforms.uInvert.value = cube_invert;
}

function toggleCubeClap(){
  cube_offset_thresh = Math.random()*400+400;
  cubeBackground.material.uniforms.uClap.value = !cubeBackground.material.uniforms.uClap.value;
}

// -------------------------------------- SPHERE
// -------------------------------------- SPHERE
// -------------------------------------- SPHERE
// -------------------------------------- SPHERE

var frictions = [];
function initSphere(){
    var count = 60000;
    var angles = new Float32Array(count * 1);
    var times = new Float32Array(count * 1);
    var speeds = new Float32Array(count * 1);
    var radii = new Float32Array(count * 1);
    var phi = new Float32Array(count * 1);
    var indexes = new Float32Array(count * 1);
    var theta = new Float32Array(count * 1);
    var face_positions = new Float32Array(count * 3);
    var positions = new Float32Array(count * 3);

    var ang = 0;
    var triangle_size = 10;
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

        frictions.push( friction )

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

    bufferGeom = new THREE.BufferGeometry()
    bufferGeom.addAttribute('aIndex', new THREE.BufferAttribute(indexes, 1))
    bufferGeom.addAttribute('aAngle', new THREE.BufferAttribute(angles, 1))
    bufferGeom.addAttribute('aTime', new THREE.BufferAttribute(times, 1))
    bufferGeom.addAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    bufferGeom.addAttribute('aRadius', new THREE.BufferAttribute(radii, 1))
    bufferGeom.addAttribute('aTheta', new THREE.BufferAttribute(theta, 1))
    bufferGeom.addAttribute('aPhi', new THREE.BufferAttribute(phi, 1))
    bufferGeom.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    bufferGeom.addAttribute('aFacePosition', new THREE.BufferAttribute(face_positions, 3))

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
      vertexShader: vsSphere,
      fragmentShader: fsSphere,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false
    });

    sphere = new THREE.Mesh(bufferGeom, bufferMat);
    sphere.position.z = -350;
}

function animateSphere(){
  sphere_theta += .01
  sphere_phi += .05

  // console.log();
  sphere.material.uniforms.uTime.value = clock.getElapsedTime();

  var sphere_move_coeff = 0.1
  sphere_phi_coeff += (sphere_phi_coeff_target - sphere_phi_coeff) * sphere_move_coeff
  sphere_theta_coeff += (sphere_theta_coeff_target - sphere_theta_coeff) * sphere_move_coeff

  var t = sphere.geometry.attributes.aTheta.array;
  var p = sphere.geometry.attributes.aPhi.array;
  for(let i = 0; i < t.length; i++){
    t[i] += (sphere_phi_coeff_target - t[i]) * frictions[ i ]
    p[i] += (sphere_theta_coeff_target - p[i]) * frictions[ i ]
  }


  //explosion
  sphere_explosion_rad += (sphere_explosion_rad_target - sphere_explosion_rad) * .3
  sphere.material.uniforms.uExplosionRadius.value = sphere_explosion_rad


  sphere_explosion_pos_a[0] += (sphere_explosion_pos_a_target[0] - sphere_explosion_pos_a[0]) * .1
  sphere_explosion_pos_a[1] += (sphere_explosion_pos_a_target[1] - sphere_explosion_pos_a[1]) * .1
  sphere_explosion_pos_a[2] += (sphere_explosion_pos_a_target[2] - sphere_explosion_pos_a[2]) * .1
  sphere.material.uniforms.uExplosionPositionA.value = new THREE.Vector3(sphere_explosion_pos_a[0], sphere_explosion_pos_a[1], sphere_explosion_pos_a[2])

  sphere_explosion_pos_b[0] += (sphere_explosion_pos_b_target[0] - sphere_explosion_pos_b[0]) * .1
  sphere_explosion_pos_b[1] += (sphere_explosion_pos_b_target[1] - sphere_explosion_pos_b[1]) * .1
  sphere_explosion_pos_b[2] += (sphere_explosion_pos_b_target[2] - sphere_explosion_pos_b[2]) * .1
  sphere.material.uniforms.uExplosionPositionB.value = new THREE.Vector3(sphere_explosion_pos_b[0], sphere_explosion_pos_b[1], sphere_explosion_pos_b[2])

  sphere.geometry.attributes.aTheta.needsUpdate = true;
  sphere.geometry.attributes.aPhi.needsUpdate = true;
}

function increaseAngle(){
  let coeff = .1
  sphere_phi_coeff_target += (Math.floor(Math.random()*5)*0.5)*coeff;
  sphere_theta_coeff_target += ((Math.floor(Math.random()*4)+1)*2)*coeff;
}

function decreaseAngle(){
  let coeff = .1
  sphere_phi_coeff_target -= (Math.floor(Math.random()*5)*0.5)*coeff;
  sphere_theta_coeff_target -= ((Math.floor(Math.random()*4)+1)*2)*coeff;
}

function decraseExplosionRadius(){
  sphere_explosion_rad_target -= (Math.floor(Math.random()*4)+3)*10
}

function increaseExplosionRadius(){
  sphere_explosion_rad_target += (Math.floor(Math.random()*4)+3)*10
}

function randomExplosionRadius(){
  sphere_explosion_rad_target = (Math.floor(Math.random()*4)+3)*50
}

function moveExplosionPosition(){

  //------------------A
  let coeff = 1
  let theta = 2 * Math.random()*Math.PI;
  let phi = Math.random()*Math.PI - Math.random()*Math.PI * 1;
  let rad = 175;
  sphere_explosion_pos_a_target[0] = Math.sin(theta) + Math.cos(phi) * rad;
  sphere_explosion_pos_a_target[1] = Math.sin(phi) * rad;
  sphere_explosion_pos_a_target[2] = Math.cos(phi) + Math.cos(theta) * rad;

  //------------------B
  sphere_explosion_pos_b_target[0] = Math.sin(theta) + Math.cos(phi) * rad;
  sphere_explosion_pos_b_target[1] = Math.sin(phi) * rad;
  sphere_explosion_pos_b_target[2] = Math.cos(phi) + Math.cos(theta) * rad;
}

function changeSphereMode(mode){
  sphere.material.uniforms.uMode.value = mode;
}

function animateNoise(){
  noise.material.uniforms.uTime.value = clock.getElapsedTime();
}

function updateNoiseInterval(property, value){
  switch(property){
    case 'vertinterval':
      noise.material.uniforms.uVerticalInterval.value = value;
      break;
    case 'vertspeed':
      noise.material.uniforms.uVerticalSpeed.value = value;
      break;
    case 'coeff':
      noise.material.uniforms.uIntervalCoeff.value = value;
      break;
    case 'modulo':
      noise.material.uniforms.uIntervalModulo.value = value;
      break;
    case 'speed':
      noise.material.uniforms.uIntervalSpeed.value = value;
      break;
    default:
      break;
  }

}

function updateNoiseBloom(property, value){
  switch(property){
    case 'speed':
      noise.material.uniforms.uBloomSpeed.value = value;
      break;
    case 'intensity':
      noise.material.uniforms.uBloomIntensity.value = value;
      break;
    default:
      break;
  }
}

function updateNoiseTan(property, value){
  switch(property){
    case 'size':
      noise.material.uniforms.uTanSquaresSize.value = value;
      break;
    case 'modulo':
      noise.material.uniforms.uTanSquareModulo.value = value;
      break;
    default:
      break;
  }
}

function updateNoiseOverlay(property, value){
  switch(property){
    case 'distance':
      noise.material.uniforms.uNoiseDist.value = value;
      break;
    case 'size':
      noise.material.uniforms.uNoiseSize.value = value;
      break;
    case 'speed':
      noise.material.uniforms.uNoiseSpeed.value = value;
      break;
    case 'impact':
      noise.material.uniforms.uNoiseImpact.value = value;
      break;
    default:
      break;
  }
}
/*
window.addEventListener('keypress', (event) => {
  if(event.key == 'm'){
    let coeff = .1
    sphere_phi_coeff_target += (Math.floor(Math.random()*5)*0.5)*coeff;
    sphere_theta_coeff_target += ((Math.floor(Math.random()*4)+1)*2)*coeff;
  }

  if(event.key == 'n'){
    let coeff = .1
    sphere_phi_coeff_target -= (Math.floor(Math.random()*5)*0.5)*coeff;
    sphere_theta_coeff_target -= ((Math.floor(Math.random()*4)+1)*2)*coeff;
  }

  if(event.key == 'w'){
    sphere_explosion_rad_target -= (Math.floor(Math.random()*4)+3)*10
  }
  if(event.key == 'e'){
    sphere_explosion_rad_target = (Math.floor(Math.random()*4)+3)*50
  }
  if(event.key == 'r'){
    sphere_explosion_rad_target += (Math.floor(Math.random()*4)+3)*10
  }

  if(event.key == 'p'){
    let coeff = 1
    let theta = 2 * Math.random()*Math.PI;
    let phi = Math.random()*Math.PI - Math.random()*Math.PI * 1;
    let rad = 175;
    sphere_explosion_pos_a_target[0] = Math.sin(theta) + Math.cos(phi) * rad;
    sphere_explosion_pos_a_target[1] = Math.sin(phi) * rad;
    sphere_explosion_pos_a_target[2] = Math.cos(phi) + Math.cos(theta) * rad;
  }

  if(event.key == 'o'){
    let coeff = 1
    let theta = 2 * Math.random()*Math.PI;
    let phi = Math.random()*Math.PI - Math.random()*Math.PI * 1;
    let rad = 175;
    sphere_explosion_pos_b_target[0] = Math.sin(theta) + Math.cos(phi) * rad;
    sphere_explosion_pos_b_target[1] = Math.sin(phi) * rad;
    sphere_explosion_pos_b_target[2] = Math.cos(phi) + Math.cos(theta) * rad;
  }

  if(event.key == 1){
    sphere.material.uniforms.uMode.value = 1;
  }

  if(event.key == 2){
    sphere.material.uniforms.uMode.value = 2;
  }

  if(event.key == 3){
    sphere.material.uniforms.uMode.value = 3;
  }


});
*/
loadAllShaders();
