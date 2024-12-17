import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import gsap from "gsap";
// Debug GUI
const gui = new dat.GUI();

// Loading Manager
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => console.log("Loading started");
loadingManager.onLoad = () => console.log("Loading completed");
loadingManager.onProgress = (url, loaded, total) =>
  console.log(`Loading: ${(loaded / total) * 100}% ${url}`);
loadingManager.onError = () => console.error("Error loading resource");

const textureLoader = new THREE.TextureLoader(loadingManager);
const texture1 = textureLoader.load("/textures/Crate.webp");
const texture2 = textureLoader.load("/textures/Crate.jpg");
const texture3 = textureLoader.load("/textures/Checker.png");
const texture4 = textureLoader.load("/textures/Minecraft.png");
const texturesArray = [texture1, texture2, texture3, texture4];
// texture.repeat.x = 2;
// texture.repeat.y = 3;
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.MirroredRepeatWrapping;

// texture.offset.x = 0.5;
// texture.offset.y = 0.5;
// texture.rotation = Math.PI * 0.25;
// texture.center.x = 0.5;
// texture.center.y = 0.5;
// this is used to aviod the blurry ness on the zoom effect
texture1.minFilter = THREE.NearestFilter;
texture2.minFilter = THREE.NearestFilter;
texture3.minFilter = THREE.NearestFilter;
texture4.minFilter = THREE.NearestFilter;
// this filter is used to fix the blurryness of the texture
texture1.magFilter = THREE.NearestFilter;
texture2.magFilter = THREE.NearestFilter;
texture3.magFilter = THREE.NearestFilter;
texture4.magFilter = THREE.NearestFilter;
// better performance and gpu load will be low
texture1.generateMipmaps = false;
texture2.generateMipmaps = false;
texture3.generateMipmaps = false;
texture4.generateMipmaps = false;
// Canvas
const canvas = document.getElementById("webgl");

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

// Geometry and Material
const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);

// Meshes
const meshes = [];
const parametersArray = [];

for (let i = 0; i < 4; i++) {
  const material = new THREE.MeshBasicMaterial({ map: texturesArray[i] });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    Math.sin((i * Math.PI) / 2) * 1.001,
    Math.cos((i * Math.PI) / 2) * 1.001,
    0
  );

  // Add mesh and parameters for GUI
  meshes.push(mesh);
  scene.add(mesh);

  // Parameters for individual mesh
  const parameters = {
    color: 0xff0000,
    spin: () => {
      gsap.to(mesh.rotation, {
        duration: 2,
        y: mesh.rotation.y + Math.PI * 2,
      });
    },
  };
  parametersArray.push(parameters);

  // GUI for each mesh
  const folder = gui.addFolder(`Box ${i + 1}`);
  folder.add(mesh.position, "x", -3, 3, 0.01).name("X Position");
  folder.add(mesh.position, "y", -3, 3, 0.01).name("Y Position");
  folder.add(mesh.position, "z", -3, 3, 0.01).name("Z Position");
  folder.add(mesh, "visible").name("Visible");
  folder.add(material, "wireframe").name("Wireframe");
  folder.addColor(parameters, "color").onChange(() => {
    material.color.set(parameters.color);
  });
  folder.add(parameters, "spin").name("Spin Box");
}

// Axes Helper
// const axesHelper = new THREE.AxesHelper(1, 1, 1);
// scene.add(axesHelper);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 5;
camera.lookAt(meshes[0].position);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Handle Window Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen Toggle
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.();
  } else {
    document.exitFullscreen?.() || document.webkitExitFullscreen?.();
  }
});

// Animation Loop
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
