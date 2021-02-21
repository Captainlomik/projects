import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { CineonToneMapping, DirectionalLight } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
let debugObject={}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */
const updateAllMaterials = ()=>{
    scene.traverse((child)=>{
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            //child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true, 
            child.receiveShadow = true
        }
    })
}

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()

gltfLoader.load(
    //'models/FlightHelmet/glTF/FlightHelmet.gltf', 
    '/models/hamburger.glb',
    (gltf)=>{
        gltf.scene.position.set(0, -2, 0)
        //gltf.scene.scale.set(5, 5, 5)
        gltf.scene.scale.set(1, 1, 1)
        gltf.scene.rotation.y = 5*Math.PI /6
        console.log(gltf.scene.rotateY)
        scene.add(gltf.scene)
      
       gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotationY')

       updateAllMaterials()
    }
)

/**
 * Textures
 */
const cubeTextures = new THREE.CubeTextureLoader()
const environmentMap = cubeTextures.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap


debugObject.envMapIntensity=5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//     new THREE.SphereBufferGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(0.25, 3, -2)
directionalLight.shadow.camera.far = 6
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(512, 512)
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping',{
    NO:THREE.NoToneMapping,
    Linear:THREE.LinearToneMapping, 
    Reinhard:THREE.ReinhardToneMapping,
    Cineon:THREE.CineonToneMapping, 
    ACESFilmic:THREE.ACESFilmicToneMapping
}).onFinishChange(()=>{
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})

gui.add(renderer, 'toneMappingExposure').min(1).max(4).step(0.01)


/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()