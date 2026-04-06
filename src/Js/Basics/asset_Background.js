import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import try1 from 'url:../assets/images/try4.jpg'
import try2 from 'url:../assets/images/try5.jpg'

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled=true;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

// Helpers
const orbital = new OrbitControls(camera, renderer.domElement);
const axesHelper = new THREE.AxesHelper(2);
const gridHelper = new THREE.GridHelper(10, 50, "white", "green");
scene.add(axesHelper);
scene.add(gridHelper);

camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);
orbital.update();

// BOX Shape
const boxGeometery = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const box = new THREE.Mesh(boxGeometery, boxMaterial);
box.position.z = 3;
// scene.add(box);

// Plane Shape
const planeGeometery = new THREE.PlaneGeometry(8, 8);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: "gray",
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometery, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow=true;
scene.add(plane);


// Sphere Shape
const sphereGeometery = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#0000ff",
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometery, sphereMaterial);
sphere.position.y=2
sphere.position.x=-1
sphere.position.z=1
sphere.castShadow=true;
scene.add(sphere);

// Dat.gui
const gui = new dat.GUI();
const options = {
  sphereColor: "#0000ff",
  wireframe: false,
};
gui.addColor(options, "sphereColor").onChange((e) => {
  sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});

let spotLight = new THREE.AmbientLight(options.spotLight,1);
scene.add(spotLight);


// Now here we will load the image as background
const textureLoader = new THREE.TextureLoader();
// This will add 2D Background
// scene.background=textureLoader.load(GalaxyImg)

// Now to load 3D background
const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
  try1,
  try1,
  try2,
  try2,
  try2,
  try2
]);

// We can also set background images to Mesh too
const cube2=new THREE.BoxGeometry(1,1,1)
const cube2Material=new THREE.MeshBasicMaterial({
  map:textureLoader.load(try1)
})
const cube2box=new THREE.Mesh(cube2,cube2Material);
cube2box.position.set(2,1,0)
scene.add(cube2box)

let step=0
const height=3
const speed=0.02
function animate() {

  step += speed;
  sphere.position.y = height * Math.abs(Math.sin(step));

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
