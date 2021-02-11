import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { CubeTexture, CubeTextureLoader } from 'three'

/**
 * DEBUG PANEL
 */
const gui = new dat.GUI()
gui.hide()


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Texture
 */

const texture = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const colorDoorTexture = texture.load('/textures/door/color.jpg')
const alphaDoorTexture = texture.load('/textures/door/alpha.jpg')
const ambientOcclusionDoorTexture = texture.load('/textures/door/ambientOcclusion.jpg')
const heightDoorTexture = texture.load('/textures/door/height.jpg')
const metalnessDoorTexture = texture.load('/textures/door/metalness.jpg')
const normalDoorTexture = texture.load('/textures/door/normal.jpg')
const rouhnessDoorTexture = texture.load('/textures/door/roughness.jpg')

const matcapTexture = texture.load('/textures/matcaps/1.png')
const gradientTexture = texture.load('/textures/gradients/3.jpg')

const enviromentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg',
])



/**
 * Objects 
 */

//  const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0x00ff00)
//  material.wireframe = true
// material.map = colorDoorTexture
// material.transparent = true
// material.alphaMap = alphaDoorTexture
// material.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial()
// material.side =  THREE.DoubleSide

// const material = new THREE.MeshMatcapMaterial()
// material.side = THREE.DoubleSide
// material.matcap = matcapTexture

// const material = new THREE.MeshLambertMaterial()
// material.side = THREE.DoubleSide

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100 //делает блик светлее/ярче 
// material.specular = new THREE.Color(0x1188ff) //меняет цвет блика

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7 //матовость 
material.roughness = 0.2 //блики
// material.map = colorDoorTexture
// material.aoMap = ambientOcclusionDoorTexture
 material.side = THREE.DoubleSide
// material.aoMapIntensity = 1
// material.displacementMap = heightDoorTexture
// material.displacementScale = 0.05
// material.metalnessMap = metalnessDoorTexture
// material.roughnessMap = rouhnessDoorTexture
// material.normalMap = normalDoorTexture
// material.normalScale.set(0.5, 0.5)
// material.alphaMap = alphaDoorTexture
// material.transparent = true
material.envMap = enviromentMapTexture


gui.add(material, 'metalness').min(0).max(1).step(0.01)
gui.add(material, 'roughness').min(0).max(1).step(0.01)
//gui.add(material, 'aoMapIntensity').min(0).max(2).step(0.1)
//gui.add(material, 'displacementScale').min(0).max(1).step(0.01)

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    material
)
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material
)
plane.position.x = 1.2
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
    material
)

torus.position.x = -1.2
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))


const cube = new THREE.Mesh(
    new THREE.CubeGeometry(), material
)

cube.position.x= 0

scene.add(sphere, cube)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * LIGHTS
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointingLight = new THREE.PointLight(0xffffff, 0.5)
pointingLight.position.x = 2
pointingLight.position.y = 3
pointingLight.position.z = 4
scene.add(pointingLight)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //update meshs position
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    torus.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()