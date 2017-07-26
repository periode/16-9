precision highp float;

attribute float aAngle;
attribute float aIndex;
attribute float aTime;
attribute float aSpeed;
attribute float aRadius;
attribute vec3 position;
attribute vec3 aFacePosition;
attribute float aTheta;
attribute float aPhi;

varying vec3 vPosition;
varying float vIndex;
varying float vAngle;
varying float vDistance;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;
uniform vec3 uExplosionPositionA;
uniform vec3 uExplosionPositionB;
uniform float uExplosionRadius;
uniform int uMode;
uniform float uRadModifier;


void main(void){
  vec3 pos = position;
  vec3 fpos = aFacePosition;
  vIndex = aIndex;
  vAngle = aAngle;

  float radius = aRadius;
  float a = aTime + uTime * aSpeed;

  float theta = aTheta * aAngle * radius + uTime * 1.;
  float phi = aAngle * radius - aAngle * aPhi + uTime * 1.;
  fpos.x += sin(theta) * cos(phi) * radius;
  fpos.y += sin(phi) * radius;
  fpos.z += cos(phi) * cos(theta) * radius;

  float dist = distance(uExplosionPositionA, fpos);

  float increase = max(0., uExplosionRadius-dist);
  vDistance = increase;


  theta = aTheta * aAngle * radius + uTime * 1.;
  phi = aAngle * radius - aAngle * aPhi + uTime * 1.;

  if(uMode == 1){
    radius += pow(increase, 1.25)*aSpeed;
    }else if(uMode == 2){
      radius += exp(increase)*aSpeed;
      }else if(uMode == 3){
        radius += log(increase)*aSpeed;
      }

      //other position
      radius = aRadius;
      dist = distance(uExplosionPositionB, fpos);
      increase = max(0., uExplosionRadius-dist);
      vDistance = increase;


      theta = aTheta * aAngle * radius + uTime * 1.;
      phi = aAngle * radius - aAngle * aPhi + uTime * 1.;

      if(uMode == 1){
        radius += pow(increase, 1.25)*aSpeed;
        }else if(uMode == 2){
          radius += exp(increase)*aSpeed;
          }else if(uMode == 3){
            radius += log(increase)*aSpeed;
          }


          pos.x += sin(theta) * cos(phi) * radius;
          pos.y += sin(phi) * radius;
          pos.z += cos(phi) * cos(theta) * radius;




          //pos += min(0., impact de l'explosion)
          //explosion = facePosition*modelViewMatrix

          vPosition = (modelViewMatrix * vec4(pos, 1.)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
        }
