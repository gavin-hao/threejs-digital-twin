<template>
  <div id="viewport" ref="viewport">
    <div class="progress" v-if="loading">
      <div class="progress-inner">
        <el-progress :percentage="50" :indeterminate="true" :show-text="false"> </el-progress>
      </div>
    </div>
    <div
      class="popover"
      ref="popover"
      v-show="showPopover"
      :style="{ '--width': `${popoverSize.width}px`, '--height': `${popoverSize.height}px` }"
    >
      <div class="popover-inner frame">
        <div class="popover-content">
          <div class="title">
            {{ selectedObjectInfo?.name }}
            <span class="close" @click="handlePopoverClose">&times;</span>
          </div>
          <div class="body">
            <div class="canvas">
              <scene2 :model-name="selectedObjectInfo?.key" :visible="showPopover"></scene2>
            </div>
            <div class="detail" v-if="selectedObjectInfo">
              <div v-for="prop in Object.keys(selectedObjectInfo)" :key="prop">
                <div v-if="prop !== 'name' && prop != 'key'">
                  <label for="">{{ prop }}</label
                  >{{ (selectedObjectInfo[prop] as any).value
                  }}<span>{{ (selectedObjectInfo[prop] as any).unit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { ElProgress } from 'element-plus';
import { Player } from '@/three';
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { useElementSize } from '@vueuse/core';
import {
  CSS2DObject,
  EffectComposer,
  OutlinePass,
  OutputPass,
  RenderPass,
  SMAAPass,
  // ShaderPass,
  // GammaCorrectionShader,
  RGBELoader,
  ProgressiveLightMap,
} from 'three/examples/jsm/Addons.js';
import { useContext } from './context';
import Scene2 from './Scene2.vue';
const player = new Player();
const shadowMapRes = 512,
  lightMapRes = 1024,
  lightmapObjects: THREE.Object3D[] = [];
let progressiveSurfacemap: ProgressiveLightMap;
// progressive lightmap

if (process.env.NODE_ENV === 'development') {
  const stats = new Stats();
  stats.dom.style.position = 'absolute';

  player.events.update.add(() => stats.update());
  onMounted(() => {
    viewport.value!.appendChild(stats.dom);
  });
}

const gui = new GUI();

const viewport = ref<HTMLElement>();
const popover = ref<HTMLElement>();
const showPopover = ref(false);
let popoverObject: CSS2DObject;
const selectedObjectInfo = ref<{ key?: string; [key: string]: unknown }>();

const context = useContext();
const loading = ref<boolean>(true);
const equipmentInfos = computed(() => {
  return context.status?.value || [];
});
let composer: EffectComposer, outlinePass: OutlinePass;
const effectParams = {
  edgeStrength: 10.0,
  edgeGlow: 0.1,
  edgeThickness: 1,
  pulsePeriod: 3.0,
  rotate: false,
  usePatternTexture: false,
  visibleEdgeColor: '#d9af17', //'#E93204',
  hiddenEdgeColor: '#190a05',
};

const { width: viewportWidth, height: viewportHeight } = useElementSize(viewport);
const popoverSize = computed(() => {
  let width = 600;
  let height = 300;
  const ratio = 2 / 1;

  if ((viewportWidth.value * 0.45) / viewportHeight.value > ratio) {
    height = viewportHeight.value;
    width = height * ratio;
  } else {
    width = viewportWidth.value * 0.45;
    height = width / ratio;
  }
  width >= 800 ? (width = 800) : width;
  height >= 400 ? (height = 400) : height;
  return {
    width,
    height,
  };
});
// const popoverInfo = computed(() => {
//   equipmentInfos.value.forEach((item) => {
//     if (item.key === selectedObjectInfo.value?.key) {
//       selectedObjectInfo.value = item;
//     }
//   });
//   return {};
// });
onMounted(async () => {
  // intersectObjects = [];

  player.setSize(viewport.value!.offsetWidth, viewport.value!.offsetHeight);
  player.setPixelRatio(window.devicePixelRatio);
  player.scene.fog = new THREE.Fog(0xcccccc, 120, 300);

  viewport.value!.appendChild(player.dom);

  context.events.focusTo.add(handleFocusTo);

  player.addControls();

  if (process.env.NODE_ENV !== 'development') {
    gui.hide();
  }
  gui.close();
  composer = new EffectComposer(player.renderer!);
  player.events.resize.add((width, height) => {
    composer.setSize(width, height);
  });

  const renderPass = new RenderPass(player.scene!, player.camera!);
  composer.addPass(renderPass);
  //#region outlinePass
  outlinePass = new OutlinePass(
    new THREE.Vector2(player.cavans.clientWidth, player.cavans.clientHeight),
    player.scene,
    player.camera!
  );
  outlinePass.visibleEdgeColor.set(effectParams.visibleEdgeColor);
  outlinePass.hiddenEdgeColor.set(effectParams.hiddenEdgeColor);
  outlinePass.pulsePeriod = effectParams.pulsePeriod;
  outlinePass.edgeGlow = effectParams.edgeGlow;
  outlinePass.edgeThickness = effectParams.edgeThickness;
  outlinePass.edgeStrength = effectParams.edgeStrength;
  composer.addPass(outlinePass);
  // width、height是canva画布的宽高度
  const { offsetWidth: width, offsetHeight: height } = player.cavans;

  const outputPass = new OutputPass();

  const pixelRatio = player.renderer!.getPixelRatio();

  const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
  composer.addPass(smaaPass);
  // 创建伽马校正通道
  // const gammaPass = new ShaderPass(GammaCorrectionShader);
  // composer.addPass(gammaPass);
  composer.addPass(outputPass);

  player.events.start.add(() => {
    console.log('start run play ');
  });

  player.events.objectSelected.add((obj: THREE.Object3D) => {
    if (obj) {
      // const selectObject = (obj as Object3DWrap).ancestors;
      onSelected(obj);
    }
  });
  loading.value = true;
  {
    const url = '/models/steelmill2/scene.glb';
    const loadmanager = THREE.DefaultLoadingManager;
    // loadmanager.onLoad=()
    const scene = await player.loader.loadFile(url, loadmanager);

    scene.name = 'steelmill';
    progressiveSurfacemap = new ProgressiveLightMap(player.renderer!, lightMapRes);
    player.addObject(scene);
  }

  // 加载hdr材质 并设置环境光贴图
  const rgbeLoader = new RGBELoader();
  const envMap = await rgbeLoader.loadAsync('/textures/skybox/industrial_sunset_02_puresky_4k.hdr ');
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // player.scene.background = envMap;
  player.scene.environment = envMap;

  // 创建弹窗的css2d模型
  // popoverObject = new CSS2DObject(popoverRef.value!);

  player.renderer!.toneMapping = THREE.NeutralToneMapping;
  player.renderer!.toneMappingExposure = 1;
  // 设置阴影
  player.enableShadows();

  player.scene.traverse((item) => {
    // console.log('item-', item.name, item);
    if (item instanceof THREE.Mesh) {
      item.material.envMap = envMap;
      item.material.envMapIntensity = 0.8;
      // item.material.needsUpdate = true;
      lightmapObjects.push(item);
      progressiveSurfacemap.addObjectsToLightMap(lightmapObjects);
    } else {
      // item.layers.disableAll(); // Disable Rendering for this
    }
  });
  // player.scene.layers.set(1);
  player.scene.traverse((item) => {
    if (!(item instanceof THREE.Object3D)) {
      return;
    }
    if (canSelect(item)) {
      for (let i = 0; i < item.children.length; i++) {
        const group = item.children[i];
        //递归遍历chooseObj，并给chooseObj的所有子孙后代设置一个ancestors属性指向自己
        group.traverse(function (obj) {
          if (obj instanceof THREE.Mesh) {
            (obj as any).ancestors = item;
          }
        });
      }
      // intersectObjects.push(item);
    }
  });
  player.events.update.add((_timer) => {
    composer.render();
    // progressiveSurfacemap.update(player.camera!, 200, true);
  });
  {
    // 添加光照
    const directionalLight = new THREE.DirectionalLight(0xfdf5ed, 8);
    directionalLight.castShadow = true;
    // directionalLight.shadow.bias = -0.05;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.mapSize.set(shadowMapRes, shadowMapRes);
    directionalLight.shadow.radius = 2;
    player.scene.add(directionalLight);
    lightmapObjects.push(directionalLight);
    player.renderer!.shadowMap.type = THREE.VSMShadowMap;

    const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // player.scene.add(cameraHelper);
    // if (process.env.NODE_ENV !== 'development') {
    //   cameraHelper.visible = false;
    // }
    const directionalLightGui = gui.addFolder('directionalLight');
    directionalLight.position.set(26, 48, 20);
    directionalLightGui.addColor(directionalLight, 'color').name('color');
    directionalLightGui.add(directionalLight, 'intensity', 0, 20, 0.1);
    directionalLightGui.add(directionalLight.position, 'x', -100, 100, 0.1);
    directionalLightGui.add(directionalLight.position, 'y', 0, 100, 0.1);
    directionalLightGui.add(directionalLight.position, 'z', -100, 100, 0.1);
    const shadowGui = directionalLightGui.addFolder('Shadow');
    shadowGui.add(directionalLight, 'castShadow').onChange((value) => {
      directionalLight.castShadow = value;
    });
    shadowGui.add(directionalLight.shadow, 'bias', -10, 10, 0.000001).onChange((_value) => {
      directionalLight.shadow.camera.updateProjectionMatrix();
    });
    shadowGui.add(directionalLight.shadow, 'radius', 0, 10, 0.1).onChange((_value) => {
      directionalLight.shadow.camera.updateProjectionMatrix();
    });
    shadowGui.add(directionalLight.shadow.mapSize, 'x', 128, 2048, 1).onChange((_value) => {
      directionalLight.shadow.camera.updateProjectionMatrix();
    });
    shadowGui.add(directionalLight.shadow.mapSize, 'y', 128, 2048, 1);
    const shadowCameraGui = directionalLightGui.addFolder('Shadow.camera');
    shadowCameraGui.add(directionalLight.shadow.camera, 'left', -300, 300, 1).onChange((_value) => {
      directionalLight.shadow.camera.updateProjectionMatrix();
      cameraHelper.update();
    });
    shadowCameraGui.add(directionalLight.shadow.camera, 'right', -300, 300, 1).onChange((_value) => {
      directionalLight.shadow.camera.updateProjectionMatrix();
      cameraHelper.update();
    });
    shadowCameraGui.add(directionalLight.shadow.camera, 'top', -300, 300, 1).onChange((_value) => {
      directionalLight.shadow.camera.updateProjectionMatrix();
      cameraHelper.update();
    });
    shadowCameraGui.add(directionalLight.shadow.camera, 'bottom', -300, 300, 1).onChange((_value) => {
      directionalLight.shadow.camera.updateProjectionMatrix();
      cameraHelper.update();
    });
    shadowCameraGui.add(directionalLight.shadow.camera, 'near', 0, 100, 0.1).onChange((_value) => {
      directionalLight.shadow.camera.updateProjectionMatrix();
      cameraHelper.update();
    });
    shadowCameraGui.add(directionalLight.shadow.camera, 'far', 0, 5000, 0.1).onChange((_value) => {
      directionalLight.shadow.camera.updateProjectionMatrix();
      cameraHelper.update();
    });

    // player.scene.add(new THREE.AmbientLight(0xfefefe, 1));
    player.scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.5));
  }

  //
  //播放动画
  const model = player.scene.getObjectByName('steelmill')!;
  const animations = model.animations;
  for (const ani of animations) {
    player.addAnimation(animations, ani.name, model);
  }
  // player.controls?.addEventListener('change', (ev) => {
  //   console.log('camera', ev.target.target, ev.target.object.position, player.camera!.position);
  // });
  player.controls!.maxDistance = 200;
  (player.camera! as THREE.PerspectiveCamera).near = 0.4;
  (player.camera! as THREE.PerspectiveCamera).far = 300;
  player.camera!.position.set(49.08655711956998, 15.013313129229896, 29.585290041126118);
  player.controls?.saveState();
  // const cameraHelper = new THREE.CameraHelper(player.camera!);
  // player.scene.add(cameraHelper);
  // if (process.env.NODE_ENV !== 'development') {
  //   cameraHelper.visible = false;
  // }
  player.play();

  loading.value = false;
});

function canSelect(object?: THREE.Object3D) {
  const intersectObjectsKey = equipmentInfos.value.map((v) => v.key);
  // equipmentInfos.value?.find((v) => v.key == object!.name || v.key == object?.userData.name);
  // if (object?.isObject3D) {
  //   console.log('intersectObjectsKey', object?.userData.name);
  // }
  return object && intersectObjectsKey.includes(object?.userData.name);
}
let chooseObject: THREE.Object3D | null = null;
function onSelected(object?: THREE.Object3D) {
  const selectObject = (object as any).ancestors || object;
  // console.log('selectObject', selectObject);

  if (!selectObject || !canSelect(selectObject)) {
    outlinePass.selectedObjects = [];
    chooseObject?.remove(popoverObject);
    chooseObject = null;
    player.events.objectSelected.dispatch(null);
    return;
  }
  chooseObject = selectObject;
  let current = equipmentInfos.value?.find((v) => v.key == selectObject.userData.name);

  // console.log('outlinedObjects', outlinedObjects);
  outlinePass.selectedObjects = [selectObject];
  if (current && current.key !== 'GaoLu') {
    selectedObjectInfo.value = {
      ...current,
    };
    showPopover.value = true;
  }
  player.events.objectFocused.dispatch(selectObject);
}
const findObject = (key: string) => {
  let object = player.scene.getObjectByName(key);
  if (!object) {
    player.scene.traverse((child) => {
      if (child.userData.name === key) {
        object = child;
        return;
      }
    });
  }
  return object;
};
const handleFocusTo = (focusKey: string) => {
  const object = findObject(focusKey);
  if (object) {
    onSelected(object);
  }
};
const handlePopoverClose = () => {
  showPopover.value = false;
  player.controls?.reset();
};
onUnmounted(() => {
  player?.dispose();
});
</script>
<style lang="scss" scoped>
#viewport {
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
  --background-color: rgba(45, 56, 85, 0.5);
  --boder-color: rgba(154, 166, 183, 0.5);
  --box-shadow-color: rgb(101, 219, 251, 0.38);
  --border-frame-color: rgb(40, 214, 140);
  position: absolute;
  // width: min(40vw, 916px);
  // height: min(calc(312 / 458 * 40vw), 624px);
  // pointer-events: none;
  // top: -150px;
  // left: 150px;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  justify-self: stretch;
  width: var(--width, 458px);
  height: var(--height, 312px);
  // background: url(@/assets/images/dialog-bg.png) no-repeat;
  // background-size: contain;
  transform: translate(-50%, -50%);
  .popover-inner {
    position: relative;
    display: flex;
    // background-color: rgb(7, 84, 140, 0.3);
    flex: auto;
    flex-direction: column;
    align-self: stretch;
    justify-self: stretch;
    padding: 0;
    backdrop-filter: blur(2px);
    border: 2px solid var(--boder-color);
    box-shadow: inset 0 0 30px var(--box-shadow-color);
  }
  .frame {
    background:
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -4px top -8px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -4px top -4px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -4px top -8px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -4px top -4px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -4px bottom -8px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) left -4px bottom -4px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -4px bottom -8px,
      linear-gradient(var(--border-frame-color), var(--border-frame-color)) right -4px bottom -4px;
    background-repeat: no-repeat;
    background-size:
      4px 44px,
      44px 4px;
    box-shadow:
      // inset 0 0 10px 2px var(--box-shadow-color),
      inset 0 0 20px 10px var(--box-shadow-color),
      inset 0 0 40px 30px var(--box-shadow-color);
    &::after {
      position: absolute;
      top: 0px;
      right: -0px;
      bottom: -0px;
      left: -0px;
      z-index: -1;
      content: '';
      background-color: var(--background-color);
    }
  }
  .popover-content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    color: #fff;

    .title {
      position: relative;
      padding: 1px;
      font-size: 16px;
      font-weight: 500;
      line-height: 36px;
      text-align: center;
      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        content: '';
        background-image: linear-gradient(
          244deg,
          rgba(255, 255, 255, 0) 0%,
          rgb(42, 227, 243) 50%,
          rgba(255, 255, 255, 0) 100%
        );
      }
      .close {
        position: absolute;
        right: 5px;
        // bottom: 5px;
        display: inline-block;
        padding: 0 8px;
        font-size: 18px;
        color: #dedede;
        cursor: pointer;
        &:hover {
          color: #fff;
          // text-decoration: underline;
        }
      }
    }
    .body {
      display: flex;
      flex: 1;
      flex-direction: row;
      // padding: 12px;
      font-size: 20px;
      .canvas {
        flex: auto;
        max-width: 60%;
      }
      .detail {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        padding: 12px;
        font-size: 20px;
        color: #e0e0e0;
        label {
          margin-right: 16px;
          font-weight: 500;
          color: #fff;
          &::after {
            content: ':';
          }
        }
        span {
          margin-left: 5px;
          font-size: 16px;
        }
      }
    }
  }
}
.warning {
  // position: absolute;
  // display: none;
  position: absolute;
  // width: 32px;
  // height: 32px;
  // display: flex;
  // top: 50%;
  // left: 50%;
  width: 12px;
  height: 12px;
  color: #e93204;
  pointer-events: none;
  animation-name: twinkle-key;
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
  .warning-content {
    position: relative;
    display: flex;
    img {
      display: block;
      width: 100%;
    }
  }
}

// .twinkle {
//   animation-name: twinkle-key;
//   animation-duration: 1s;
//   animation-iteration-count: infinite;
// }

@keyframes twinkle-key {
  50% {
    opacity: 0.5;
  }
}
</style>
