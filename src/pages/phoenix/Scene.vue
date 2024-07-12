<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div id="scene" class="scene-container" ref="containerEl"></div>
  <div class="popover" ref="popoverRef" v-show="false">
    <div class="popover-content">
      <div class="title">{{ selectedObjectInfo?.name }}</div>
      <div class="body">
        <div class="status">
          <div class="data"><span class="number">1.3</span> MPa</div>
          <div class="label">峰值压力</div>
        </div>
        <div class="status">
          <div class="data"><span class="number">69.8</span> mm</div>
          <div class="label">最小缓冲</div>
        </div>
        <div class="status">
          <div class="data"><span class="number">3.5</span> mm</div>
          <div class="label">V-P位置</div>
        </div>
        <div class="status">
          <div class="data"><span class="number">9.8</span> MPa</div>
          <div class="label">V-P压力</div>
        </div>
      </div>
    </div>
  </div>
  <div class="progress" v-if="loading">
    <div class="progress-inner">
      <el-progress :percentage="loadingProgress?.percentage" color="#3CE6E6"> </el-progress>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import useThree, { initStats, loadGLTF, Object3DWrap } from '@/hooks/useThree';
import { ElProgress } from 'element-plus';

import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
// import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js';
// import { Sky } from 'three/addons/objects/Sky.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
// import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
// import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
// import { findParent } from '@/hooks/useThree/utils';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';
// import { useContext } from './context';
export interface Progress {
  loaded: number;
  total: number;
  percentage: number;
}

let composer: EffectComposer, outlinePass: OutlinePass;
const effectParams = {
  edgeStrength: 20.0,
  edgeGlow: 1,
  edgeThickness: 3.0,
  pulsePeriod: 2.0,
  rotate: false,
  usePatternTexture: false,
  visibleEdgeColor: '#E93204',
  hiddenEdgeColor: '#190a05',
};

// GUI 可视化调整参数
const guiPanel = new GUI();
let stats!: Stats;
// let sky: Sky, sun: THREE.Vector3;
const loading = ref(true);
const loadingProgress = ref<{ loaded: number; total: number; percentage: number }>();
const { scene, containerEl, camera, render, controls, renderer, addEventListener, onResize, focus } = useThree();
const models = new THREE.Group();
models.name = 'phoenix_scene';
const popoverRef = ref<HTMLElement>();
let popoverObject: CSS2DObject;
const emits = defineEmits<{
  loading: [progress: Progress];
}>();
const selectedObjectInfo = ref<{ name: string; [key: string]: unknown }>();
onMounted(async () => {
  loading.value = true;
  await init();
  render((_deltaTime) => {
    stats?.update();
    composer.render();
  });
  loading.value = false;
});

const init = async () => {
  // 设置相机初始位置
  camera.value!.position.set(4.506875689487712, 22.082972359757825, 15.904369701340569);
  controls.value!.minDistance = 5;
  controls.value!.maxDistance = 100;

  // controls.value!.addEventListener('change', (ev) => {
  //   console.log('controls-change', ev.target.target, ev.target.object.position, camera.value!.position);
  // });
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

  renderer.value!.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.value!.toneMappingExposure = 0.5;
  // 创建弹窗的css2d模型
  popoverObject = new CSS2DObject(popoverRef.value!);

  // initSky();
  // createAxisHelper();
  // 设置光照
  initLights();
  initEffectComposer();
  onResize(() => {
    const { offsetWidth: width, offsetHeight: height } = renderer.value!.domElement;
    composer.setSize(width, height);
  });
  if (process.env.NODE_ENV === 'development') {
    stats = initStats(containerEl.value!);
  }
  if (process.env.NODE_ENV !== 'development') {
    guiPanel.hide();
  }
  guiPanel.close();
  const intersectObjects: Array<THREE.Object3D> = [];
  models.traverse((item) => {
    if (!(item instanceof THREE.Object3D)) {
      return;
    }
    if (isZhusuji(item) || isChongyaji(item) || isKongyaji(item) || isBofenghan(item)) {
      for (let i = 0; i < item.children.length; i++) {
        const group = item.children[i];
        //递归遍历chooseObj，并给chooseObj的所有子孙后代设置一个ancestors属性指向自己
        group.traverse(function (obj) {
          if (obj instanceof THREE.Mesh) {
            (obj as Object3DWrap).ancestors = item;
          }
        });
      }
      intersectObjects.push(item);
    }
  });

  addEventListener('pointermove', onPointermove, intersectObjects);
  addEventListener('dblclick', ondblclick, intersectObjects);

  outlinePass.selectedObjects = [];
  const zhusuji = models.getObjectByName(`zhusuji_01`);
  console.log('zhusuji', [...zhusuji!.children]);
  outlinePass.selectedObjects.push(zhusuji!);
};
const initEffectComposer = () => {
  initEffectGui();

  // postprocessing
  composer = new EffectComposer(renderer.value!);

  const renderPass = new RenderPass(scene.value!, camera.value!);
  composer.addPass(renderPass);
  outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene.value!, camera.value!);
  outlinePass.visibleEdgeColor.set(effectParams.visibleEdgeColor);
  outlinePass.hiddenEdgeColor.set(effectParams.hiddenEdgeColor);
  outlinePass.pulsePeriod = effectParams.pulsePeriod;
  outlinePass.edgeGlow = effectParams.edgeGlow;
  outlinePass.edgeThickness = effectParams.edgeThickness;
  outlinePass.edgeStrength = effectParams.edgeStrength;
  composer.addPass(outlinePass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);
  // const pixelRatio = renderer.value!.getPixelRatio();
  // // width、height是canva画布的宽高度
  // const { offsetWidth: width, offsetHeight: height } = renderer.value!.domElement;
  // const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
  // composer.addPass(smaaPass);
};
const initEffectGui = () => {
  const effectPanel = guiPanel.addFolder('effect');
  effectPanel.add(effectParams, 'edgeStrength', 0.01, 10).onChange(function (value) {
    outlinePass.edgeStrength = Number(value);
  });

  effectPanel.add(effectParams, 'edgeGlow', 0.0, 1).onChange(function (value) {
    outlinePass.edgeGlow = Number(value);
  });

  effectPanel.add(effectParams, 'edgeThickness', 1, 4).onChange(function (value) {
    outlinePass.edgeThickness = Number(value);
  });

  effectPanel.add(effectParams, 'pulsePeriod', 2, 5).onChange(function (value) {
    outlinePass.pulsePeriod = Number(value);
  });

  effectPanel.add(effectParams, 'rotate');

  effectPanel.add(effectParams, 'usePatternTexture').onChange(function (value) {
    outlinePass.usePatternTexture = value;
  });

  effectPanel.addColor(effectParams, 'visibleEdgeColor').onChange(function (value) {
    outlinePass.visibleEdgeColor.set(value);
  });

  effectPanel.addColor(effectParams, 'hiddenEdgeColor').onChange(function (value) {
    outlinePass.hiddenEdgeColor.set(value);
  });
};
let chooseObject: THREE.Object3D | null = null;
const onPointermove = (intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]) => {
  if (intersects.length > 0) {
    const selectObject = (intersects[0].object as Object3DWrap).ancestors;
    if (!selectObject) {
      return;
    }
    if (isZhusuji(selectObject) || isChongyaji(selectObject) || isKongyaji(selectObject) || isBofenghan(selectObject)) {
      // outlinePass.selectedObjects = [...selectObject.children];
      //tag会标注在intersects[0].object.ancestors模型的局部坐标系原点位置
      // popoverObject.position.set(-100, 10, 100);
      popoverObject.name = 'tag_' + selectObject.name;
      popoverObject.center.set(-0.1, 1.1);
      selectObject.add(popoverObject);
      // console.log('popoverObject', selectObject);
      chooseObject = selectObject;
      selectedObjectInfo.value = {
        name: selectObject.userData?.name,
      };
      selectObject.children.forEach((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.material.emissive.setHex((child as any).currentHex);
        }
      });
      // equipment.currentHex = equipment.currentHex ?? equipment.material.emissive.getHex();
      // equipment.material.emissive.setHex(0xff0000);
    }
  } else {
    // outlinePass.selectedObjects = [];
    chooseObject?.remove(popoverObject);
    chooseObject = null;
  }
};

const ondblclick = (intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]) => {
  if (intersects.length > 0) {
    const selectObject = (intersects[0].object as Object3DWrap).ancestors;
    if (!selectObject) {
      return;
    }
    if (
      !(isZhusuji(selectObject) || isChongyaji(selectObject) || isKongyaji(selectObject) || isBofenghan(selectObject))
    ) {
      return;
    }
    console.log('ondblclick ondblclick', selectObject.name);

    // 移动相机靠近观察选中的对象
    focus(selectObject);
  }
};

const isZhusuji = (object: THREE.Object3D) => {
  return object.name?.includes('zhusuji') && object.userData?.tag === 'zhusuji';
};
const isChongyaji = (object: THREE.Object3D) => {
  return object.name?.includes('chongyaji') && object.userData?.tag === 'chongyaji';
};
const isKongyaji = (object: THREE.Object3D) => {
  return object.name?.includes('kongyaji') && object.userData?.tag === 'kongyaji';
};
const isBofenghan = (object: THREE.Object3D) => {
  return object.name?.includes('bofenghan') && object.userData?.tag === 'bofenghan';
};
const loadAllModels = async () => {
  await Promise.all([loadPhoenixModel()]);
};
const loadPhoenixModel = async () => {
  const url = '/models/phoenix/scene.glb'; //'/models/scene.glb';
  try {
    const phoenix = await loadModel(url);
    // console.log(phoenix.scene, 'gltf.scene');
    phoenix.scene.name = 'phoenix';
    // phoenix.scene.position.set(0, 0, 0);
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
// const path = '/textures/skybox/daytime/';

const initLights = () => {
  //probe;
  // const lightProbe = new THREE.LightProbe();
  // scene.value!.add(lightProbe);
  // const loader = new THREE.CubeTextureLoader().setPath(path);
  // const texture = loader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'], (cubeTexture) => {
  //   scene.value!.background = cubeTexture;
  //   lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture));
  // });
  // const probePanel = guiPanel.addFolder('LightProbe');
  // probePanel.add(lightProbe, 'intensity', 0, 100).name('intensity');
  scene.value!.getObjectByName('phoenix')?.traverse((item) => {
    // console.log(item, 'item');
    if (item instanceof THREE.Mesh) {
      item.castShadow = true;
      item.receiveShadow = true;
      // item.material.envMap = texture; //sky.material;
      // item.material.envMapIntensity = 0.5;
    }
  });

  const ambientLight = new THREE.AmbientLight(0x606060, 0.5);
  scene.value!.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(5, 10, 7.5);
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
// const initSky = () => {
//   // Add Sky
//   sky = new Sky();
//   sky.scale.setScalar(450000);
//   scene.value!.add(sky);

//   sun = new THREE.Vector3();
//   /// GUI

//   const effectController = {
//     turbidity: 10,
//     rayleigh: 3,
//     mieCoefficient: 0.005,
//     mieDirectionalG: 0.7,
//     elevation: 2,
//     azimuth: 180,
//     exposure: renderer.value!.toneMappingExposure,
//   };
//   function guiChanged() {
//     const uniforms = sky.material.uniforms;
//     uniforms['turbidity'].value = effectController.turbidity;
//     uniforms['rayleigh'].value = effectController.rayleigh;
//     uniforms['mieCoefficient'].value = effectController.mieCoefficient;
//     uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

//     const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
//     const theta = THREE.MathUtils.degToRad(effectController.azimuth);

//     sun.setFromSphericalCoords(1, phi, theta);

//     uniforms['sunPosition'].value.copy(sun);

//     renderer.value!.toneMappingExposure = effectController.exposure;
//     renderer.value!.render(scene.value!, camera.value!);
//   }
//   // 设置sky参数
//   const skyPanel = guiPanel.addFolder('sky');
//   skyPanel.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
//   skyPanel.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
//   skyPanel.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
//   skyPanel.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
//   skyPanel.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged);
//   skyPanel.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
//   skyPanel.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);
//   guiChanged();
// };
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
// const phoenixContext = useContext();
// defineExpose({
//   focusTo: (name: string) => {
//     const obj = models.getObjectByName(name);
//     if (obj) {
//       focus(obj);
//     }
//   },
// });
// const timer = setInterval(() => {
//   outlinePass.selectedObjects = [];
//   const zhusuji = models.getObjectByName(`zhusuji_0${props.data?.zhusuji}`);
//   if (zhusuji) {
//     outlinePass.selectedObjects.push(...zhusuji.children);
//   }
//   const kongyaji = models.getObjectByName(`kongyaji_0${props.data?.kongyaji}`);
//   if (kongyaji) {
//     outlinePass.selectedObjects.push(...kongyaji.children);
//   }
//   const bofenghan = models.getObjectByName(`bofenghan_0${props.data.bofenghan}`);
//   if (bofenghan) {
//     outlinePass.selectedObjects.push(...bofenghan.children);
//   }
//   const chongyaji = models.getObjectByName(`chongyaji_0${props.data.chongyaji}`);
//   if (chongyaji) {
//     outlinePass.selectedObjects.push(...chongyaji.children);
//   }
// }, 200);
onMounted(() => {});
onUnmounted(() => {
  // clearInterval(timer);
});
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
.popover {
  position: absolute;
  width: 300px;
  height: 200px;
  pointer-events: none;
  // top: -150px;
  // left: 150px;
  // top: -10%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  background: url(@/assets/images/dialog-bg.png) no-repeat;
  background-size: contain;
  .popover-content {
    position: relative;
    color: #fff;
    .title {
      padding: 1px;
      font-size: 16px;
      // line-height: 20px;
      text-align: center;
    }
    .body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      padding: 12px;
      font-size: 20px;
      .status {
        text-align: center;
        .data {
          .number {
            margin-right: 5px;
            font-size: 80%;
            color: #0cd36c;
          }
        }
        .label {
          font-size: 60%;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
}
</style>
