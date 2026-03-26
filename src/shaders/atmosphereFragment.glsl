uniform float uTime;

varying vec3 vNormal;

void main() {
  float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);

  float pulse = 0.5 + 0.5 * sin(uTime * 0.4);
  vec3 glowColor = mix(vec3(0.2, 0.5, 1.0), vec3(0.4, 0.8, 1.0), pulse);

  gl_FragColor = vec4(glowColor * intensity, intensity);
}

