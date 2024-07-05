import * as THREE from 'three';
import { CSS2DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/addons/libs/stats.module.js';
export function initScene() {
  const scene = new THREE.Scene();
  return scene;
}

export function initCamera(element: HTMLElement) {
  const fov = 45;
  const near = 0.1;
  const far = 2000;
  const aspect = element.clientWidth / element.clientHeight;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 0);
  return camera;
}

export function initCSSRender(element: HTMLElement) {
  const CSSRenderer = new CSS2DRenderer();
  CSSRenderer.setSize(element.clientWidth, element.clientHeight);
  CSSRenderer.domElement.style.position = 'absolute';
  CSSRenderer.domElement.style.top = '0px';
  element.appendChild(CSSRenderer.domElement);
  return CSSRenderer;
}

export function initRenderer(element: HTMLElement) {
  // @see https://threejs.org/docs/index.html#api/zh/renderers/WebGLRenderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true, //执行抗锯齿
    alpha: true, //设置背景色透明
    // precision:'highp',//色精度选择 highp/mediump/lowp
  });

  renderer.shadowMap.enabled = true;

  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(element.clientWidth, element.clientHeight);
  renderer.clearDepth();
  element.appendChild(renderer.domElement);
  return renderer;
}

export function initControls(camera: THREE.Camera, domElement: HTMLElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
  controls.enableDamping = true; //启用阻尼
  // controls.minDistance = 2;
  // controls.maxDistance = 100;
  controls.target.set(0, 0, 0);
  // controls.target.set(2, 12, 11);
  // controls.target.applyEuler(new THREE.Euler(-65, 15, 30));
  // controls.update();
  return controls;
}

export function initStats(element: HTMLElement) {
  const stats = new Stats();
  stats.dom.style.position = 'absolute';
  element.appendChild(stats.dom);
  return stats;
}

export function initLights(scene: THREE.Scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(-4, 8, 4);
  scene.add(directionalLight);
  // const dhelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.7);
  hemisphereLight.position.set(0, 8, 0);
  // const hHelper = new THREE.HemisphereLightHelper(hemisphereLight, 5);
}
