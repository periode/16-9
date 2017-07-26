precision highp float;

varying vec3 vPosition;
varying float vIndex;
varying float vDistance;
varying float vAngle;

uniform float uTime;

uniform float uThetaCoeff;
uniform float uPhiCoeff;

float a;

void main(void){
  vec3 col = vec3(1.);
  col.r = col.g = col.b = (sin(vPosition.y*0.005 + vPosition.x*0.005 + uTime*1.5) + .5)*0.5;
  for(float i = 0.; i < 10.; i+= 1.){
    col.r += (sin(vPosition.z*0.005 + vPosition.x*0.005 + uTime*(i*0.1+.5)) + .5)*0.015;
    col.g += (sin(vPosition.z*0.005 + vPosition.x*0.005 + uTime*(i*0.1+.5)) + .5)*0.015;
    col.b += (sin(vPosition.z*0.005 + vPosition.x*0.005 + uTime*(i*0.1+.5)) + .5)*0.015;
  }

  for(float i = 0.; i < 10.; i+= 1.){
    col.r += (cos(vPosition.z*0.005 - vPosition.y*0.005 - uTime*(i*0.5+.5)) + .5)*0.015 + 0.05;
    col.g += (cos(vPosition.z*0.005 - vPosition.y*0.005 - uTime*(i*0.5+.5)) + .5)*0.015 + 0.05;
    col.b += (cos(vPosition.z*0.005 - vPosition.y*0.005 - uTime*(i*0.5+.5)) + .5)*0.015 + 0.05;
  }



  //shadows at the end
  if(vAngle < 0.00001 * 1000.){
    a = vAngle*100.;
  }else if(vAngle > 0.00001 * 18000.){
    a = (0.2-vAngle)*50.;
  }else{
    a = .5;
  }

  a -= vDistance/400.;

  // col.r = (50000.-vIndex)/50000.;


  gl_FragColor = vec4(col, a);

  // gl_FragColor = vec4(vDistance/200.);
}
