precision highp float;

#define HASHSCALE1 .1031

uniform float uTime;
varying vec3 vPosition;
vec3 col;
float alpha;

float hash11(float p) {
	vec3 p3  = fract(vec3(p) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
  alpha = 1.;
  if(distance(vec3(0., 0., 0.), vPosition) < 60.){
    // col = vec3( (sin(hash11(vPosition.x + uTime*0.0001))+1.)*0.5);
    // col.r = col.g = col.b = pow(col.r, 10.);
    // col.r += (sin(hash11(vPosition.y + uTime*0.0001))+1.)*0.5;
    // col.g += (sin(hash11(vPosition.y + uTime*0.0001))+1.)*0.5;
    // col.b += (sin(hash11(vPosition.y + uTime*0.0001))+1.)*0.5;

    col = vec3(hash11((vPosition.y-100.-uTime*10.)*0.000005));

    float innerMosaic = mod(vPosition.x + uTime, 1.);
    col.r -= innerMosaic;
    col.g -= innerMosaic;
    col.b -= innerMosaic;

    float move = mod(vPosition.x*1. + vPosition.y*0.3 * vPosition.z * 1. + uTime*0.00001, 3.);
    col.r *= move;
    col.g *= move;
    col.b *= move;


  }else{
    col = vec3(0.);
  }
  gl_FragColor = vec4(col, alpha);
}
