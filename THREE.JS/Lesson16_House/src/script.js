import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {
    DoubleSide
} from 'three'

/**
 * LOADER MATERIAl
 */

const textureLoader = new THREE.TextureLoader()

const doorColor = textureLoader.load('/textures/door/color.jpg')
const doorAlpha = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusion = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeight = textureLoader.load('/textures/door/height.jpg')
const doorNormal = textureLoader.load('/textures/door/normal.jpg')
const doorMetalness = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughtness = textureLoader.load('/textures/door/roughness.jpg')

const briksColor = textureLoader.load('textures/bricks/color.jpg')
const briksNormal = textureLoader.load('textures/bricks/normal.jpg')
const briksRoughness = textureLoader.load('textures/bricks/roughness.jpg')
const briksAmbientOcclusion = textureLoader.load('textures/bricks/ambientOcclusion.jpg')

const grassColor = textureLoader.load('/textures/grass/color.jpg')
const grassNormal = textureLoader.load('textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('textures/grass/roughness.jpg')
const grassAmbientOcclusion = textureLoader.load('textures/grass/ambientOcclusion.jpg')

const windowColor = textureLoader.load('/textures/window/basecolor.jpg')
const windowAmbientOcclusion = textureLoader.load('/textures/window/ambientOcclusion.jpg')
const windowHeight = textureLoader.load('/textures/window/height.png')
const windowMaterial = textureLoader.load('/textures/window/Material.jpg')
const windowMetallic = textureLoader.load('/textures/window/metallic.jpg')
const windowNormal = textureLoader.load('/textures/window/normal.jpg')
const windowRoughness = textureLoader.load('/textures/window/roughness.jpg')
const windowOpacity = textureLoader.load('/textures/window/opacity.jpg')

grassColor.repeat.set(8, 8)
grassNormal.repeat.set(8, 8)
grassRoughness.repeat.set(8, 8)
grassAmbientOcclusion.repeat.set(8, 8)

grassColor.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping

grassColor.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping




/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//FOG 
const fog = new THREE.Fog('#262837', 1, 20)
scene.fog = fog

/**
 * Arrow Helper
 */

// var axesHelper = new THREE.AxesHelper(5);
// axesHelper.position.x = -3
// axesHelper.position.z = -5

// scene.add(axesHelper);


/**
 * House
 */
const house = new THREE.Group()
scene.add(house)


//walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: briksColor,
        aoMap: briksAmbientOcclusion,
        normalMap: briksNormal,
        roughnessMap: briksRoughness
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))

walls.position.y = 2.5 / 2
house.add(walls)

//roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.2, 1.5, 4),
    new THREE.MeshStandardMaterial({
        color: '#b35f45'
    })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 1.5 / 2
house.add(roof)

//door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2, 2.2, 10, 10),
    new THREE.MeshStandardMaterial({
        map: doorColor,
        side: DoubleSide,
        transparent: true,
        alphaMap: doorAlpha,
        aoMap: doorAmbientOcclusion,
        normalMap: doorNormal,
        displacementMap: doorHeight,
        displacementScale: 0.1,
        metalnessMap: doorMetalness,
        roughnessMap: doorRoughtness
    })
)
door.position.x = 2.01
door.position.y = 1
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))

door.rotation.y = Math.PI * 0.5
house.add(door)

//Bushes 
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#89c854'
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(0.5, 0.2, 2.2)
bush1.scale.set(0.5, 0.5, 0.5)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.set(1.2, 0.1, 2.1)
bush2.scale.set(0.3, 0.25, 0.25)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(2.2, 0.1, -1.6)
bush3.scale.set(0.3, 0.25, 0.25)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.position.set(2.2, 0.1, -1.3)
bush4.scale.set(0.4, 0.4, 0.4)

house.add(bush1, bush2, bush3, bush4)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColor,
       // roughnessMap: grassRoughness,
        normalMap: grassNormal,
        aoMap: grassAmbientOcclusion,
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))


floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

///window
const windowHouse = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 1, 50, 50),
    new THREE.MeshBasicMaterial({
        side: DoubleSide,
        map: windowColor,
        roughnessMap: windowRoughness,
        normalMap: windowNormal,
        aoMap: windowAmbientOcclusion,
        displacementMap: windowHeight,
        metalnessMap: windowMetallic,
        transparent: true,
        alphaMap: windowOpacity,
        displacementScale: 0.1,
        color:'#615d5d'
    })
)
windowHouse.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(windowHouse.geometry.attributes.uv.array, 2))
    console.log(windowHouse.geometry.attributes)

windowHouse.position.x = 0
windowHouse.position.z = -2.01
windowHouse.position.y = 1.5
house.add(windowHouse)


//Graves 
const graves = new THREE.Group()
scene.add(graves)

const graveMaterial = new THREE.MeshStandardMaterial({
    color: '#b2b6b1'
})

for (let i = 0; i < 40; i++) {
    const graveGeometry = new THREE.DodecahedronGeometry(Math.random() * 0.4)

    const angle = Math.random() * Math.PI * 2
    const radius = 5 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    grave.rotation.x = (Math.random() - 0.5) * 0.6
    grave.rotation.y = (Math.random() - 0.5) * 0.6
    grave.position.set(x, 0, z)
    grave.castShadow = true
    graves.add(grave)
}


/**
 * GHOST
 */

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)


//Door light 
const doorLight = new THREE.PointLight('#ff7d46', 1, 4)
doorLight.position.set(2.5, 2.4, 0)
house.add(doorLight)



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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * SHADOWS
 */
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
windowHouse.castShadow = true

floor.receiveShadow = true


doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    const ghostAngle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghostAngle) * 4
    ghost1.position.z = Math.sin(ghostAngle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)


    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)


    const ghost3Angle = elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 3)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()