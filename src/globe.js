import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'

import globeImg from './assets/globe.jpg'

export function initGlobe() {
  const canvas = document.getElementById('scene')
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.0006)

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 18)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputEncoding = THREE.sRGBEncoding

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enablePan = false
  controls.minDistance = 10
  controls.maxDistance = 40

  const clock = new THREE.Clock()

  // Group for globe + atmosphere
  const globeGroup = new THREE.Group()
  scene.add(globeGroup)

  // Texture
  const textureLoader = new THREE.TextureLoader()
  const globeTexture = textureLoader.load(globeImg)
  globeTexture.colorSpace = THREE.SRGBColorSpace

  // Globe
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(5, 64, 64),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: { value: globeTexture },
        uTime: { value: 0.0 }
      }
    })
  )
  globeGroup.add(globe)

  // Atmosphere
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5.2, 64, 64),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,     
      uniforms: {
        uTime: { value: 0.0 }
      }
    })
  )
  atmosphere.scale.set(1.15, 1.15, 1.15) 
  globeGroup.add(atmosphere)

  // Starfield
  const starGeometry = new THREE.BufferGeometry()
  const starCount = 8000
  const starPositions = new Float32Array(starCount * 3)

  for (let i = 0; i < starCount * 3; i += 3) {
    const radius = 200 + Math.random() * 400
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    starPositions[i] = radius * Math.sin(phi) * Math.cos(theta)
    starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
    starPositions[i + 2] = radius * Math.cos(phi)
  }

  starGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(starPositions, 3)
  )

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    sizeAttenuation: true
  })

  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  // Mouse-driven rotation (smoothed)
  const mouse = { x: 0, y: 0 }
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  })

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  function animate() {
    requestAnimationFrame(animate)

    const elapsed = clock.getElapsedTime()

    globe.rotation.y += 0.002
    stars.rotation.y += 0.0005

    const targetX = -mouse.y * 0.4
    const targetY = mouse.x * 0.6
    globeGroup.rotation.x += (targetX - globeGroup.rotation.x) * 0.05
    globeGroup.rotation.y += (targetY - globeGroup.rotation.y) * 0.05

    globe.material.uniforms.uTime.value = elapsed
    atmosphere.material.uniforms.uTime.value = elapsed

    controls.update()
    renderer.render(scene, camera)
  }

  animate()
}
