/*
team pic/some rly nice pic
what is robomasters
team overview
socals
*/
import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js'
import { STLLoader } from 'https://unpkg.com/three@0.120.1/examples/jsm/loaders/STLLoader'
import { GLTFLoader } from 'https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls'

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



const ambientLight = new THREE.AmbientLight(0xffffff) // floods sceen with light
scene.add(ambientLight)

// const lightHelper = new THREE.PointLightHelper(pointLight) // gives wirefram to light
const gridHelper = new THREE.GridHelper(200, 50) // adds grid to sceen
scene.add(gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement)

scene.background = new THREE.TextureLoader().load('../assets/space.jpg')// loads img

function lerp(a, b, t) { return a + (b - a) * t }
function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

/*
const material = new THREE.MeshPhysicalMaterial({
  color: 0xb2ffc8,
  metalness: 0.25,
  roughness: 0.1,
  opacity: 1.0,
  transparent: true,
  transmission: 0.99,
  clearcoat: 1.0,
  clearcoatRoughness: 0.25
})
const loader = new STLLoader()
loader.load(
  '../assets/STD-GML-Rotation_Pulley.STL',
    function (geometry) {
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    mesh.position.set(0,0,0)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
    console.log(error)
  }
)
*/
const loader = new GLTFLoader()
let robot = null;
loader.load(
  '../assets/CarBlue.glb',
  function (gltf) {
    gltf.scene.scale.set(50, 50, 50)
    gltf.scene.rotation.x += 0.01
    robot = gltf.scene
    // gltf.scene.traverse(function (child) {
    //     if ((child as THREE.Mesh).isMesh) {
    //         const m = (child as THREE.Mesh)
    //         m.receiveShadow = true
    //         m.castShadow = true
    //     }
    //     if (((child as THREE.Light)).isLight) {
    //         const l = (child as THREE.Light)
    //         l.castShadow = true
    //         l.shadow.bias = -.003
    //         l.shadow.mapSize.width = 2048
    //         l.shadow.mapSize.height = 2048
    //     }
    // })
    scene.add(gltf.scene)
  },
  (xhr) => {
    // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
    console.log(error)
  }
)
//m stands for max hight
let points = [
  { m: 0, x: 0, y: 10, z: 30 },
  { m: 500, x: 0, y: 20, z: 30 },
  { m: 1000, x: 20, y: 10, z: 30 },
  { m: 1500, x: 20, y: 10, z: -20 },
  { m: 3500, x: -50, y: 10, z: -10 }
]

camera.position.set(points[0].x, points[0].y, points[0].z)
//====================move cam on scroll==================== 
let i = 1
function moveCamera() {
  if(i<1) i = 1
  else if (i <= 5) i = 4
  //gets distance from top of pg when scrolling
  let t = document.body.getBoundingClientRect().top //NOTE: always negitive
  let curPoint = points[i]
  let pastPoint = points[i - 1]
  t = (t + pastPoint.m) / (curPoint.m - pastPoint.m)// t has to stay between 0 and 1
  // console.log('t :>> ', t);

  if (t < -1) {
    i++
  } else if (t > 0) {
    i--
  }
  // console.log("t after:", t);

  camera.position.x = lerp(pastPoint.x, curPoint.x, ease(-t))
  camera.position.y = lerp(pastPoint.y, curPoint.y, ease(-t))
  camera.position.z = lerp(pastPoint.z, curPoint.z, ease(-t))
  camera.lookAt(0,10,0)
}

// runs func everytime user scrolls
document.body.onscroll = moveCamera
//====================  main control loop (game loop) ====================
function animate() {
  requestAnimationFrame(animate) // tells browser to perform an animation

  if (robot) robot.rotation.y += 0.01

  // controls.update()//lets us move around in the browser
  renderer.render(scene, camera) // updates UI
}
animate()