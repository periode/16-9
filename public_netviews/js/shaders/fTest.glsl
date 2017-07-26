precision mediump float;

uniform vec4 uColor;
uniform float uTime;
varying vec4 vPosition;

void main() {
  float x = uColor.x + (vPosition.x+1.0)*0.5;
  float y = (sin(uTime)+1.0)*0.5;
  gl_FragColor = vec4(x, y, uColor.z, 1);
}
