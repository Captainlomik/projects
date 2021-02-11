import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import  gsap from 'gsap'


//DEBUG PANEL 
const gui = new dat.GUI()
gui.hide()

const parameters = {
    color:0xff0000, 
    spin:() =>{
        gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + 10})
    }
}

//TEXTURES
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./color.jpg')

//RESIZE WINDOW
window.addEventListener('resize', ()=>{

    sizes.width = window.innerWidth,
    sizes.height=window.innerHeight

    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.setPixelRatio, 2))
})

const cursor = {
    x:0, 
    y:0
}

//CATCH MOUSE
 window.addEventListener('mousemove',(event)=>{
     cursor.x = event.clientX/sizes.width - 0.5
     cursor.y = - (event.clientY/sizes.height - 0.5)
} )


//FULSCREEN VIEW
window.addEventListener('dblclick', ()=>{
    if(!document.fullscreenElement){
        canvas.requestFullscreen()
    }
    else {
      document.exitFullscreen()
    }
})

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
   map:texture
})
const mesh = new THREE.Mesh(geometry, material)
texture.magFilter=THREE.NearestFilter

//mesh.position.set(0, 1, 0)
//Добавляет прямые
// const axesHeler = new THREE.AxesHelper()

 scene.add(mesh)

 //DEBUG 
gui.add(mesh.position, 'x', -3, 3, 0.01)

gui.add(mesh, 'visible')
gui.add(material, 'wireframe')
gui.addColor(parameters, 'color').onChange(()=>{
    material.color.set(parameters.color)
})

gui.add(parameters, 'spin')
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3

scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enabled=true
controls.enableDamping=true

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


const clock = new THREE.Clock()

function tick() {
    const elapsedTime = clock.getElapsedTime()

    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    camera.position.y = cursor.y * 4
    camera.lookAt(mesh.position)


    //mesh.rotation.y =elapsedTime
    //mesh.position.x = Math.sin(elapsedTime)
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}


 
tick()



