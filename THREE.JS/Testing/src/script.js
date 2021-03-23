import { appendFile } from "fs"
import fragment from "./shaders/fragment.glsl"
import vertex from  "./shaders/vertex.glsl"
import "./style.scss"
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DoubleSide } from "three"
import CANNON from 'cannon'
import landscape from './img/bg.jpg'

/**
 * Base
 */
//Canvas
const canvas = document.querySelector('.canvasModel')

//Scene 
const scene = new THREE.Scene()

//GUI
const gui = new dat.GUI({width:340})

/**
 * PHYSYCS
 */

//Material

//material = new THREE.MeshNormalMaterial()
let t =  new THREE.TextureLoader().load(landscape)
t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping

 const material = new THREE.ShaderMaterial({
    side:THREE.DoubleSide,
    fragmentShader:fragment,
    vertexShader:vertex,
    uniforms:{
        process:{type:"f", value:0},
        landscape:{value: t}
    },
    //wireframe:true
})


// const defaultMaterial =  new CANNON.Material('default')
// const softMaterial = new CANNON.Material('soft', -1)
// const defaultContactMaterial = new CANNON.ContactMaterial(
//     softMaterial, 
//     defaultMaterial,{
//         friction:1, 
//         restitution:1
//     }
// )

// const depthMaterial = new THREE.MeshDepthMaterial({
//     depthPacking:THREE.RGBADepthPacking
// })


/**
 * Cube
 */
// const cube = new THREE.Mesh(
//     new THREE.SphereBufferGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness:0.3, 
//         roughness:0.4
//     })
// )
// cube.position.y = 0.5
// scene.add(cube)

//Floor
// const floor = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(6,6),
//     new THREE.MeshStandardMaterial({
//         color:'#777777', 
//         metalness:0.3,
//         roughness:0.4,
//         side:DoubleSide
//     })
// )
// floor.rotation.x = -Math.PI * 0.5
// scene.add(floor)

// const floorShape = new CANNON.Plane()
// const floorBody = new CANNON.Body()
// floorBody.mass=0
// floorBody.addShape(floorShape)
// floorBody.mass = defaultMaterial
// floorBody.quaternion.setFromAxisAngle(
//     new CANNON.Vec3(-1, 0, 0), 
//     Math.PI * 0.5 + 0.01
// )
// world.addBody(floorBody)

// const floor = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry(5, 5), 
//     new THREE.MeshStandardMaterial({
//         color:'#777777', 
//         metalness:0.5, 
//         roughness:0.4,
//         side:DoubleSide
//     })
// )
// floor.rotation.x = -Math.PI * 0.5
//scene.add(floor)

//Sizes 
const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
}

//Resize 
window.addEventListener('resize', ()=>{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update Camera 
    camera.aspect = sizes.width /sizes.height
    camera.updateProjectionMatrix()

    //Update renderer 
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRation(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-8, 2, 1)
scene.add(camera)

//Controls 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
*/

const renderer = new THREE.WebGLRenderer({
    canvas:canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(0xebebeb, 0);



/**
 * Light
 */
const ambientLight= new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const pointerLight = new THREE.PointLight(0x00ff00, 4, 20 )
pointerLight.position.set(2, 8, 2 )
scene.add(pointerLight)


// const customUniforms = {
//     uTime : {value:0}
// }   

// const createSphere = (radius, position)=>{
    
//       const sphereGeometry =  new THREE.CylinderGeometry( 2, 2, 2 );
//       const sphereMaterial = new THREE.MeshStandardMaterial({
//             emissive:0xbd4be3,
//             emissiveIntensity:0.5,
//             roughness:0.61, 
//             metalness:0.21, 
//             side: DoubleSide, 
//             color:'black'
//         })
//     }

//scene.add(createSphere)

const geometry = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2, 1),
    // new THREE.MeshStandardMaterial({
    //     wireframe:true
    // })
    material
)

geometry.position.set(1, 2, 1)


scene.add(geometry)

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime  - oldElapsedTime
    oldElapsedTime = elapsedTime

    //world.step(1/60, deltaTime, 3)

    //Update controls
    controls.update()

    renderer.render(scene, camera)

    //call tick again on the next frame 
    window.requestAnimationFrame(tick)
}

tick()

