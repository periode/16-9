function initShaders(){
  console.log('successfully initShaders');
}

function animateShader(){
  console.log('rendering');
}


var fsTest, vsTest;

vsTest = "lol";

function fetch(){
	loadShader('buffer', 'vs');
	loadShader('buffer', 'fs');
}

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
