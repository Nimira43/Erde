uniform sampler2D globeTexture;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
  vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);

  // subtle day-night tint shift
  float dayNight = 0.5 + 0.5 * sin(uTime * 0.05);
  vec3 texColor = texture2D(globeTexture, vUv).rgb;
  texColor *= mix(0.8, 1.1, dayNight);

  gl_FragColor = vec4(atmosphere + texColor, 1.0);
}
