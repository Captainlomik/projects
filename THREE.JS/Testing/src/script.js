import { appendFile} from "fs"
import fragment from "./shaders/fragment.glsl"
import fragment1 from "./shaders/fragment1.glsl"
import vertex from "./shaders/vertex.glsl"
import "./style.scss"
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import landscape from './img/bg.jpg'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass'
import {PostProcessing} from './postprocessing'



/**
 * Base
 */
//Canvas
const canvas = document.querySelector('.canvasModel')


//Scene 
const scene = new THREE.Scene()

//GUI
const gui = new dat.GUI({
    width: 340
})


/**
 * Mouse 
 */
let mouse = 0
let lastX = 0
let lastY = 0
let speed = 0

document.addEventListener('mousemove', (e)=>{
    speed = Math.sqrt((e.pageX - lastX)**2 +(e.pageY - lastY)**2) *0.1;
    lastX = e.pageX;
    lastY = e.pageY;
})

//Material

let t = new THREE.TextureLoader().load(landscape)
t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping

const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    extensions:{
        derivatives:"#extension GL_OES_standard_derivatives : enable"
    },
    fragmentShader: fragment,
    vertexShader: vertex,
    uniforms: {
        time: {
            type: "f",
            value: 0
        },
        mouse: {
            value: 0
        },
        landscape: {
            value: t
        },
        resolution:{type:"v4", value: new THREE.Vector4()},
        uvRate1:{
            value: new THREE.Vector2(1,1)
        }
    },
    //wireframe:true
})

const material1 = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    extensions:{
        derivatives:"#extension GL_OES_standard_derivatives : enable"
    },
    fragmentShader: fragment1,
    vertexShader: vertex,
    uniforms: {
        time: {
            type: "f",
            value: 0
        },
        mouse: {
            value: 0
        },
        landscape: {
            value: t
        },
        resolution:{type:"v4", value: new THREE.Vector4()},
        uvRate1:{
            value: new THREE.Vector2(1,1)
        }
    }
})

//Sizes 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Resize 
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update Camera 
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //Update renderer 
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRation(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-2, 0, 1)
scene.add(camera)

//Controls 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)

//Точки на экране
let  composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

let customPass = new ShaderPass( PostProcessing );
customPass.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
customPass.uniforms[ "resolution" ].value.multiplyScalar( window.devicePixelRatio );
composer.addPass( customPass );

composer.setSize(sizes.width, sizes.height)
renderer.setClearColor(0xebebeb, 0);
composer.render()


/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const pointerLight = new THREE.PointLight(0x00ff00, 4, 20)
pointerLight.position.set(2, 8, 2)
scene.add(pointerLight)


let geometry1 =
    new THREE.IcosahedronBufferGeometry(1.1, 1)

let length = geometry1.attributes.position.array.length


let bary = []

for (let i = 0; i < length/3; i++) {
    bary.push(0, 0, 1, 0, 1, 0, 0, 0, 1)
}


let aBary = new Float32Array(bary)

geometry1.setAttribute('aBary', new THREE.BufferAttribute(aBary, 3),)

let ico = new THREE.Mesh(geometry1, material)
let icoLines = new THREE.Mesh(geometry1, material1)

ico.position.set(0, 0, 0)

scene.add(ico)
scene.add(icoLines)


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0


const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    ico.rotation.x = elapsedTime / 20
    icoLines.rotation.x = elapsedTime / 20
    
    //Update controls
    mouse -=(mouse - speed) * 0.05;
    speed*=0.99

    controls.update()
   
    customPass.uniforms.howmuchrgbshifticanhas.value = mouse/5
    customPass.uniforms.time.value = elapsedTime
    material1.uniforms.time.value = elapsedTime
    material1.uniforms.mouse.value = mouse/5
    material.uniforms.time.value = elapsedTime
    material.uniforms.mouse.value = mouse/5
   
    //renderer.render(scene, camera)
    composer.render()

    //call tick again on the next frame 
    window.requestAnimationFrame(tick)
}

tick()

