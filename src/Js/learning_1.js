import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
scene.add(box);
box.position.z = 3;

// Plane Shape
const planeGeometery = new THREE.PlaneGeometry(8, 8);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: "gray",
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometery, planeMaterial);
scene.add(plane);
plane.rotation.x = -Math.PI / 2;


// Sphere Shape
const sphereGeometery = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#0000ff",
  wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeometery, sphereMaterial);
scene.add(sphere);

// Dat.gui
const gui = new dat.GUI();
const options = {
  sphereColor: "#0000ff",
  wireframe: true,
  sphereBouncingSpeed: 0.01,
  sphereHeight: 2,
  sphereRotatingSpeed: 0.01,
  ambiantLight: "#ffffff",
  ambiantLightIntensity:1
};
gui.addColor(options, "sphereColor").onChange((e) => {
  sphere.material.color.set(e);
});

gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});
gui.add(options, "sphereRotatingSpeed", 0.01, 0.2);
gui.add(options, "sphereBouncingSpeed", 0.01, 0.2);
gui.add(options, "sphereHeight", 1, 10);

// Ambiant Lighting
let ambiantLights = new THREE.DirectionalLight(options.ambiantLight,1);
scene.add(ambiantLights);
gui.addColor(options, "ambiantLight").onChange((e) => {
  ambiantLights.color.set(e);
});
gui.add(options, "ambiantLightIntensity",1,10).onChange((e) => {
  ambiantLights.intensity=e;
});

let step = 0;
function animate() {
  // Rotational Animation
  sphere.rotation.y += options.sphereRotatingSpeed;

  // Ball Bounce Animation
  step += options.sphereBouncingSpeed;
  sphere.position.y = options.sphereHeight * Math.abs(Math.sin(step));
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
