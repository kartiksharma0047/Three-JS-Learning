// Here we made color changing fragment shader via mouse position like hovering effect change color
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
  u_mouse: { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
};

window.addEventListener("mousemove", (e) => {
  uniforms.u_mouse.value.set(
    e.clientX / window.innerWidth,
    1.0 - e.clientY / window.innerHeight,
  );
});

const vertexShader = `
  void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  void main() {
      vec2 st = gl_FragCoord.xy / u_resolution;
      st.x *= u_resolution.x / u_resolution.y;
      vec2 mouse = u_mouse;
      mouse.x *= u_resolution.x / u_resolution.y;
      float dist = distance(st, mouse);
      float radius = 0.2;
      float circle = smoothstep(radius, radius - 0.05, dist);
      vec3 baseColor = vec3(0.3);
      vec3 gradientColor = vec3(
          0.5 + 0.5 * sin(u_time + st.x * 3.0),
          0.5 + 0.5 * sin(u_time + st.y * 3.0),
          0.5 + 0.5 * sin(u_time)
      );
      vec3 color = mix(baseColor, gradientColor, circle);
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
