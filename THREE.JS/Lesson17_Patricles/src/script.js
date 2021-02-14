import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {
    BufferGeometry,
    ParametricGeometry
} from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/textures/particles/10.png')

/**
 * Particles
 */
// const particlesGeometry = new THREE.BufferGeometry()
// const count = 200

// const positions = new Float32Array(count * 3)
// const colors = new Float32Array(count * 3)

// for (let i = 0; i < count * 3; i++) {
//     positions[i] = (Math.random() - 0.5) * 10
//     colors[i] = Math.random()
// }

// particlesGeometry.setAttribute('position',
//     new THREE.BufferAttribute(positions, 3))
// particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// //Material 
// const particlesMaterial = new THREE.PointsMaterial()
// particlesMaterial.size = 0.5
// particlesMaterial.sizeAttenuation = true
// particlesMaterial.transparent = true
// particlesMaterial.alphaMap = particlesTexture
// //particlesMaterial.alphaTest = 0.01 //убирает черный квадрат 
// //particlesMaterial.depthTest = false //лучше убирает черные текстуры, но не работает физика. Все остальные фигуры прорачны
// particlesMaterial.depthWrite = false //куб не прозрачный, текстуры убраны
// particlesMaterial.blending = THREE.AdditiveBlending //делает пузыри ярче, если они попадают друг на друга
// particlesMaterial.vertexColors = true

// //Points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)

/**
 * GALAXY
 */
const parametrs = {
    size: 0.02,
    count: 10000,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.02,
    randomnessPower: 2,
    inColor: '#ff6030',
    outColor: '#1b3984'
}

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    //Destroy old galaxy
    if (points != null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }


    geometry = new THREE.BufferGeometry()
    const position = new Float32Array(parametrs.count * 3)
    const colors = new Float32Array(parametrs.count * 3)

    const colorInside = new THREE.Color(parametrs.inColor)
    const colorOuntside = new THREE.Color(parametrs.outColor)



    for (let i = 0; i < parametrs.count; i++) {

        let i3 = i * 3

        //position
        const radius = Math.random() * parametrs.radius
        const spinAngle = radius * parametrs.spin
        const branchAngle = (i % parametrs.branches) / parametrs.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parametrs.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parametrs.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parametrs.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        position[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        position[i3 + 1] = randomY
        position[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        //color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOuntside, radius / parametrs.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material 
     */

    material = new THREE.PointsMaterial({
        size: parametrs.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    points = new THREE.Points(geometry, material)
    scene.add(points)

}

generateGalaxy()

//GUI
gui.add(parametrs, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parametrs, 'size').min(0.01).max(0.5).step(0.01).onFinishChange(generateGalaxy)
gui.add(parametrs, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parametrs, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parametrs, 'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy)
gui.add(parametrs, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy)
gui.add(parametrs, 'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy)
gui.add(parametrs, 'inColor').onFinishChange(generateGalaxy)
gui.add(parametrs, 'outColor').onFinishChange(generateGalaxy)

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
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //не лучшее решение для анимации
    // for (let i = 0; i < count; i++) {
    //     let i3= i *3 

    //     const x = particlesGeometry.attributes.position.array[i3]
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    // }
    // particlesGeometry.attributes.position.needsUpdate = true


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()