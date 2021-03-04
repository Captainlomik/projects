import { appendFile } from "fs"
import "./style.scss"
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { DoubleSide } from "three"
import CANNON from 'cannon'

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
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)



/**
 * Cube
 */
const cube = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness:0.3, 
        roughness:0.4
    })
)
cube.position.y = 0.5
scene.add(cube)

//Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(6,6),
    new THREE.MeshStandardMaterial({
        color:'#777777', 
        metalness:0.3,
        roughness:0.4,
        side:DoubleSide
    })
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)


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
camera.position.set(-6, 2, 1)
scene.add(camera)

//Controls 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
*/

const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width, sizes.height)
//renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Light
 */
const ambientLight= new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const pointerLight = new THREE.PointLight(0x00ff00, 1, 10 )
pointerLight.position.set(1, 5, 1 )
scene.add(pointerLight)

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    cube.position.y = Math.sin(elapsedTime)

    //Update controls
    controls.update()

    renderer.render(scene, camera)

    //call tick again on the next frame 
    window.requestAnimationFrame(tick)
}

tick()
