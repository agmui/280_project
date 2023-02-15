
// guide: https://www.youtube.com/watch?v=Q7AOvWpIVHU
//NOTE: makesure in css have the "main" elm have `position: absolute` 
// import './styles/funny.css'

// import * as THREE from 'three'
import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'//lets us move around the sceen
// import { OrbitControls } from 'https://unpkg.com/three@0.120.1/jsm/controls/OrbitControls'

//==================== setup ==================== 
// setup needs 3 things: scene, cam, renderer
// init scene
const scene = new THREE.Scene()

// init cam
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({ // choosing which elm to use
  canvas: document.querySelector('#bg')
})

renderer.setPixelRatio(window.devicePixelRatio) //set renderer pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
// camera.position.setZ(30)//move cam along the Z axies

// renderer.render(scene, camera)// renders the scene

//==================== creating object example ====================
//objects needs: geometry, material, Mesh
const geometry = new THREE.TorusGeometry(10, 3, 16, 100) // make geometry
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 })// make material
const torus = new THREE.Mesh(geometry, material)

scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff) // adds light
pointLight.position.set(20, 20, 20) // move light to 5,5,5

const ambientLight = new THREE.AmbientLight(0xffffff) // floods sceen with light
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight) // gives wirefram to light
const gridHelper = new THREE.GridHelper(200, 50) // adds grid to sceen
scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement)

// createing 200 random stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material)
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x, y, z)
  scene.add(star)
}
Array(200).fill().forEach(addStar)

// set background
const spaceTexture = new THREE.TextureLoader().load('assets/space.jpg')// loads img
scene.background = spaceTexture

// texter mapping
const jeffTexture = new THREE.TextureLoader().load('assets/jeff.png')

const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: jeffTexture })
)
scene.add(jeff)

//moon 
const moonTexture = new THREE.TextureLoader().load('assets/moon.jpg')
const normalTexture = new THREE.TextureLoader().load('assets/normal.jpg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
)
scene.add(moon)

moon.position.z = 30//same thing
moon.position.setX(-10)

//====================move cam on scroll==================== 
function moveCamera() {
  //gets distance from top of pg when scrolling
  const t = document.body.getBoundingClientRect().top //NOTE: always negitive
  moon.rotation.x += 0.05
  moon.rotation.y += 0.075
  moon.rotation.z += 0.05

  jeff.rotation.y += 0.01
  jeff.rotation.z += 0.01

  camera.position.z = t * -0.01
  camera.position.x = t * -0.0002
  camera.position.y = t * -0.0002
}

// runs func everytime user scrolls
document.body.onscroll = moveCamera

//====================  main control loop (game loop) ====================
function animate() {
  requestAnimationFrame(animate) // tells browser to perform an animation

  torus.rotation.x += 0.01 // rotate on x every frame
  torus.rotation.y += 0.005 // rotate on x every frame
  torus.rotation.z += 0.01 // rotate on x every frame

  // controls.update()//lets us move around in the browser

  renderer.render(scene, camera) // updates UI
}
animate()