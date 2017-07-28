var global_time = 0;
var phi_coeff_target = 0;
var phi_coeff = 0;
var theta_coeff_target = 0;
var theta_coeff = 0;

var explosion_pos_a = [-200, 0, 0];
var explosion_pos_a_target = [-200, 0, 0];
var explosion_pos_b = [200, 0, 0];
var explosion_pos_b_target = [200, 0, 0];
var explosion_rad = 0;
var explosion_rad_target = 0;

var theta = 0
var phi = 0
var radius = 150


function initShaders(){
  // initSphere();
  initCube();
}

function animateShader(){
  // animateSphere();
  animateCube();
}


var fsSphere, vsSphere;

function loadAllShaders(){
	loadShader('sphere', 'vs');
	loadShader('sphere', 'fs');
}

function loadShader(file, type, variable){
	$.ajax({
			async: true,
			url: "js/shaders/" + file + "." + type, //todo: use global config for shaders folder?
			dataType: "text",
			success: function(result) {
				console.log("succesfully loaded shader file: "+file+"."+type);
				if(type == 'vs')
					vsSphere = result;
				if(type == 'fs')
					fsSphere = result;
			},
			fail: function(){
				console.log("unable to load shader file: "+file+"."+type);
				// return null;
			}
	});
}

function initCube(){

}

function animateCube(){

}

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
    stage.add(sphere);
}

function animateSphere(){
  theta += .01
  phi += .05

  global_time += 0.01
  // console.log(global_time);
  sphere.material.uniforms.uTime.value = global_time;

  var move_coeff = 0.1
  phi_coeff += (phi_coeff_target - phi_coeff) * move_coeff
  theta_coeff += (theta_coeff_target - theta_coeff) * move_coeff

  var t = sphere.geometry.attributes.aTheta.array;
  var p = sphere.geometry.attributes.aPhi.array;
  for(let i = 0; i < t.length; i++){
    t[i] += (phi_coeff_target - t[i]) * frictions[ i ]
    p[i] += (theta_coeff_target - p[i]) * frictions[ i ]
  }


  //explosion
  explosion_rad += (explosion_rad_target - explosion_rad) * .3
  sphere.material.uniforms.uExplosionRadius.value = explosion_rad


  explosion_pos_a[0] += (explosion_pos_a_target[0] - explosion_pos_a[0]) * .1
  explosion_pos_a[1] += (explosion_pos_a_target[1] - explosion_pos_a[1]) * .1
  explosion_pos_a[2] += (explosion_pos_a_target[2] - explosion_pos_a[2]) * .1
  sphere.material.uniforms.uExplosionPositionA.value = new THREE.Vector3(explosion_pos_a[0], explosion_pos_a[1], explosion_pos_a[2])

  explosion_pos_b[0] += (explosion_pos_b_target[0] - explosion_pos_b[0]) * .1
  explosion_pos_b[1] += (explosion_pos_b_target[1] - explosion_pos_b[1]) * .1
  explosion_pos_b[2] += (explosion_pos_b_target[2] - explosion_pos_b[2]) * .1
  sphere.material.uniforms.uExplosionPositionB.value = new THREE.Vector3(explosion_pos_b[0], explosion_pos_b[1], explosion_pos_b[2])

  sphere.geometry.attributes.aTheta.needsUpdate = true;
  sphere.geometry.attributes.aPhi.needsUpdate = true;
}

window.addEventListener('keypress', (event) => {
  if(event.key == 'm'){
    let coeff = .1
    phi_coeff_target += (Math.floor(Math.random()*5)*0.5)*coeff;
    theta_coeff_target += ((Math.floor(Math.random()*4)+1)*2)*coeff;
  }

  if(event.key == 'n'){
    let coeff = .1
    phi_coeff_target -= (Math.floor(Math.random()*5)*0.5)*coeff;
    theta_coeff_target -= ((Math.floor(Math.random()*4)+1)*2)*coeff;
  }

  if(event.key == 'w'){
    explosion_rad_target -= (Math.floor(Math.random()*4)+3)*10
  }
  if(event.key == 'e'){
    explosion_rad_target = (Math.floor(Math.random()*4)+3)*50
  }
  if(event.key == 'r'){
    explosion_rad_target += (Math.floor(Math.random()*4)+3)*10
  }

  if(event.key == 'p'){
    let coeff = 1
    let theta = 2 * Math.random()*Math.PI;
    let phi = Math.random()*Math.PI - Math.random()*Math.PI * 1;
    let rad = 175;
    explosion_pos_a_target[0] = Math.sin(theta) + Math.cos(phi) * rad;
    explosion_pos_a_target[1] = Math.sin(phi) * rad;
    explosion_pos_a_target[2] = Math.cos(phi) + Math.cos(theta) * rad;
  }

  if(event.key == 'o'){
    let coeff = 1
    let theta = 2 * Math.random()*Math.PI;
    let phi = Math.random()*Math.PI - Math.random()*Math.PI * 1;
    let rad = 175;
    explosion_pos_b_target[0] = Math.sin(theta) + Math.cos(phi) * rad;
    explosion_pos_b_target[1] = Math.sin(phi) * rad;
    explosion_pos_b_target[2] = Math.cos(phi) + Math.cos(theta) * rad;
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

loadAllShaders();
