import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

// Helpers
const orbital = new OrbitControls(camera, renderer.domElement);

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
plane.receiveShadow = true;
scene.add(plane);

// Sphere Shape
const sphereGeometery = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "#0000ff",
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometery, sphereMaterial);
sphere.position.y = 2;
sphere.position.x = 0;
sphere.position.z = 0;
sphere.castShadow = true;
scene.add(sphere);

const CubeGeometery = new THREE.BoxGeometry(2, 2, 2);
const CubeMaterial = new THREE.MeshStandardMaterial({
  color: "#ff0000",
});
const Cube = new THREE.Mesh(CubeGeometery, CubeMaterial);
Cube.position.set(3, 2, -3);
Cube.castShadow = true;
scene.add(Cube);

// We will give ID to sphere and Cube and we can also give them custom names for indentitifying them
const CubeId = Cube.id;
const SphereId = sphere.id;
Cube.name = "Cube1";
sphere.name = "sphere1";

let spotLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(spotLight);

// Ray Castor
const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const rayCastor = new THREE.Raycaster();

let step = 0;
const height = 3;
const speed = 0.02;
function animate() {
  step += speed;
  sphere.position.y = height * Math.abs(Math.sin(step));

  sphere.material.color.set(0x0000ff);

  rayCastor.setFromCamera(mousePosition, camera);

  const intersects = rayCastor.intersectObjects([sphere, Cube]);

  if (intersects.length > 0) {
    const hit = intersects[0].object;

    if (hit.id === SphereId) {
      hit.material.color.set(0xff00ff);
    }

    if (hit.name === 'Cube1') {
      Cube.rotation.x += 0.05;
      Cube.rotation.y += 0.05;
    }
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
