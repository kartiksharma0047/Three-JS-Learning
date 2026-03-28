import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

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
const orbital=new OrbitControls(camera,renderer.domElement)

const axesHelper = new THREE.AxesHelper(2);
const gridHelper = new THREE.GridHelper(10,50,'white','green');
scene.add(axesHelper);
scene.add(gridHelper);

camera.position.set(2, 2, 5);
camera.lookAt(0, 0, 0);
orbital.update()

const boxGeometery = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const box = new THREE.Mesh(boxGeometery, boxMaterial);
scene.add(box)

const planeGeometery=new THREE.PlaneGeometry(5,5);
const planeMaterial=new THREE.MeshBasicMaterial({
  color:"gray",
  side:THREE.DoubleSide
});
const plane=new THREE.Mesh(planeGeometery,planeMaterial);
scene.add(plane)
plane.rotation.x=-Math.PI/2;

function animate() {
  box.rotation.y += 0.01;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
