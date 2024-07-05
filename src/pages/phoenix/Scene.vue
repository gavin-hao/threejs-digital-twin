<template>
  <div id="scene" class="scene-container" ref="containerEl"></div>
  <div class="progress" v-if="loading">
    <div class="progress-inner">
      <el-progress :percentage="loadingProgress?.percentage" color="#3CE6E6"> </el-progress>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import useThree, { initStats, loadGLTF } from '@/hooks/useThree';
import { ElProgress } from 'element-plus';

import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js';
export interface Progress {
  loaded: number;
  total: number;
  percentage: number;
}
// GUI 可视化调整参数
const guiPanel = new GUI();
let stats!: Stats;
const loading = ref(true);
const loadingProgress = ref<{ loaded: number; total: number; percentage: number }>();
const { scene, containerEl, camera, render, controls, distroy, renderer } = useThree();
const models = new THREE.Group();
models.name = 'phoenixMain';
const emits = defineEmits<{
  loading: [progress: Progress];
}>();

onMounted(async () => {
  loading.value = true;
  await init();
  render((_deltaTime) => {
    stats?.update();
  });
  loading.value = false;
});
onUnmounted(() => {
  distroy();
});
const init = async () => {
  // 设置相机初始位置
  camera.value!.position.set(4.506875689487712, 22.082972359757825, 15.904369701340569);
  controls.value!.minDistance = 5;
  controls.value!.maxDistance = 100;
  // 添加地面
  // const ground = new THREE.Mesh(
  //   new THREE.PlaneGeometry(80, 80, 2, 2),
  //   new THREE.MeshPhongMaterial({ color: 0x999999, side: THREE.DoubleSide })
  // );
  // ground.name = 'ground';
  // ground.position.set(0, 0, -10);
  // ground.rotation.x = -Math.PI / 2;
  // ground.receiveShadow = true;
  // scene.value!.add(ground);
  //网格辅助线
  // const grid = new THREE.GridHelper(100, 100);
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  // scene.value!.add(grid);

  await loadAllModels();
  scene.value!.add(models);
  // createAxisHelper();
  // 设置光照
  setLights();

  // const mesh = scene.value!.getObjectByName('phoenix');

  if (process.env.NODE_ENV === 'development') {
    stats = initStats(containerEl.value!);
  }
  if (process.env.NODE_ENV !== 'development') {
    guiPanel.hide();
  }
};
const loadAllModels = async () => {
  await Promise.all([loadPhoenixModel()]);
};
const loadPhoenixModel = async () => {
  const url = '/models/phoenix.glb';
  try {
    const phoenix = await loadModel(url);
    // console.log(phoenix.scene, 'gltf.scene');
    phoenix.scene.name = 'phoenix';
    phoenix.scene.position.set(0, 0, 0);
    models.add(phoenix.scene);
  } catch (_err) {
    /** catch error */
  }
};

// const createAxisHelper = () => {
//   const axis = new THREE.AxesHelper(10);
//   axis.layers.enableAll();
//   scene.value!.add(axis);
// };
const path = '/textures/skybox/night/';

const setLights = () => {
  // probe
  const lightProbe = new THREE.LightProbe();
  scene.value!.add(lightProbe);
  const loader = new THREE.CubeTextureLoader().setPath(path);
  const texture = loader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'], (cubeTexture) => {
    scene.value!.background = cubeTexture;

    lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture));
  });

  scene.value!.getObjectByName('phoenix')?.traverse((item) => {
    console.log(item, 'item');
    if (item instanceof THREE.Mesh) {
      item.castShadow = true;
      item.receiveShadow = true;
      item.material.envMap = texture;
      item.material.envMapIntensity = 0.5;
    }
  });
  guiPanel.close();
  const probePanel = guiPanel.addFolder('LightProbe');
  probePanel.add(lightProbe, 'intensity', 0, 100).name('intensity');

  const ambientLight = new THREE.AmbientLight(0x606060, 0.5);
  scene.value!.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(-4, 10, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.radius = 3;
  renderer.value!.shadowMap.type = THREE.VSMShadowMap;
  scene.value!.add(directionalLight);
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 1);
  hemisphereLight.position.set(0, 8, 0);
  scene.value!.add(hemisphereLight);
  // 设置灯光参数
  const lightPanel = guiPanel.addFolder('Light');
  const AmbientSetting = lightPanel.addFolder('AmbientLight');
  AmbientSetting.add(ambientLight, 'intensity', 0, 100).name('intensity');
  const hemisphereSetting = lightPanel.addFolder('HemisphereLight');
  hemisphereSetting.add(hemisphereLight, 'intensity', 1, 50).name('intensity');
  const directionalSetting = lightPanel.addFolder('DirectionalLight');
  directionalSetting.add(directionalLight, 'intensity', 0, 50).name('intensity');
  // directionalSetting.add(directionalLight.position, 'x').name('position.x');
  // directionalSetting.add(directionalLight.position, 'y').name('position.y');
  // directionalSetting.add(directionalLight.position, 'z').name('position.z');
  directionalSetting.add(directionalLight.shadow, 'radius').name('shadow.radius');
  // directionalSetting.add(directionalLight.shadow.camera, 'far').name('shadow.camera.far');
  // directionalSetting.add(directionalLight.shadow.camera, 'near').name('shadow.camera.near');
  // lightPanel.open();
};
const loadModel = (url: string) => {
  return new Promise<GLTF>((resolve, reject) => {
    loadGLTF(
      url,
      (model) => {
        return resolve(model);
      },
      ({ loaded, total }) => {
        let percentage = ~~Math.abs(loaded / total) * 100; //Math.round(Math.abs(loaded / total) * 100);
        emits('loading', { loaded, total, percentage });
        if (percentage >= 100) {
          setTimeout(() => {
            loadingProgress.value = { loaded, total, percentage };
          }, 50);
        }
        // console.log(percentage + '% loaded =======');
      },
      (err) => {
        console.error('模型加载错误--》' + (err as Error)?.message, err);
        return reject(err);
      }
    );
  });
};
</script>
<style lang="scss" scoped>
.scene-container {
  width: 100%;
  height: 100%;
}
.progress {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background: rgb(18, 19, 40);
  .progress-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30%;
    font-size: 12px;
    transform: translate(-50%, -50%);
  }
}
</style>
