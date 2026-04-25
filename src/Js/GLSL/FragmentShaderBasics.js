// Here we made gradient color changing fragment shader
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 12);
orbit.update();

const uniforms = {
  u_time: { type: "f", value: 0.0 },
  u_resolution: {
    type: "v2",
    value: new THREE.Vector2(
      window.innerWidth,
      window.innerHeight,
    ).multiplyScalar(window.devicePixelRatio),
  },
};

const vertexShader = `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec2 u_resolution;
    uniform float u_time;
    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution;
        vec3 color = vec3(
            0.5 + 0.5 * sin(u_time + st.x * 3.0),
            0.5 + 0.5 * sin(u_time + st.y * 3.0),
            0.5 + 0.5 * sin(u_time)
        );
        gl_FragColor = vec4(color, 1.0);
    }
`;

const geometry = new THREE.PlaneGeometry(10, 10, 30, 30);

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  wireframe: true,
  uniforms,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const timer = new THREE.Timer();
function animate() {
  uniforms.u_time.value = timer.getElapsed();
  timer.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
