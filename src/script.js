import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// Character
const characterTexture = textureLoader.load('./Card/Card-Character-Image-no-BG-PNG.png')
characterTexture.colorSpace = THREE.SRGBColorSpace
// Background
const backgroundTexture = textureLoader.load('./Card/Card-Background-Image-Expanded.jpg')
backgroundTexture.colorSpace = THREE.SRGBColorSpace
// Border
const borderTexture = textureLoader.load('./Card-Border-PNG.png')
borderTexture.colorSpace = THREE.SRGBColorSpace

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

/**
 * Card
 */
// Background Card
const backgroundCard = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({
        map: backgroundTexture
    })
)
backgroundCard.position.z = - 1.5
backgroundCard.scale.set(1.5, 1.5, 1.5)

// Border
// const border = new THREE.Mesh(
//     new THREE.PlaneGeometry(1.8, 1.5),
//     new THREE.MeshBasicMaterial({
//         transparent: true,
//         map: borderTexture
//     })
// )

// Character Card
const characterCard = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 1.5),
    new THREE.MeshBasicMaterial({
        transparent: true,
        map: characterTexture
    })
)
characterCard.position.y = - 0.2
characterCard.position.z = + 0.75

scene.add(characterCard, backgroundCard)

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 4
scene.add(camera)

/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Mouse Interaction
document.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    characterCard.rotation.y = x * 0.5;
    characterCard.rotation.x = y * 0.5;
    backgroundCard.rotation.y = x * 0.5;
    backgroundCard.rotation.x = y * 0.5;
    border.rotation.y = x * 0.5;
    border.rotation.x = y * 0.5;
  });

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()