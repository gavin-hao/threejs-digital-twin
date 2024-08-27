<template>
  <div id="viewport" ref="viewport">
    <div class="progress" v-if="loading">
      <div class="progress-inner">
        <el-progress :percentage="50" :indeterminate="true" :show-text="false"> </el-progress>
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
import {
  CSS2DObject,
  EffectComposer,
  OutlinePass,
  OutputPass,
  RenderPass,
  SMAAPass,
  RGBELoader,
  UnrealBloomPass,
} from 'three/examples/jsm/Addons.js';
import { useContext } from './context';

const player = new Player();

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

let popoverObject: CSS2DObject;
const selectedObjectInfo = ref<{ [key: string]: unknown }>();
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

onMounted(async () => {
  // intersectObjects = [];

  player.setSize(viewport.value!.offsetWidth, viewport.value!.offsetHeight);
  player.setPixelRatio(window.devicePixelRatio);
  // player.scene.fog = new THREE.Fog(0xcccccc, 2, 450);

  viewport.value!.appendChild(player.dom);

  context.events.focusTo.add(handleFocusTo);

  player.addControls();

  if (process.env.NODE_ENV !== 'development') {
    gui.hide();
  }

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
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
  bloomPass.threshold = 1;
  bloomPass.strength = 0.13;
  bloomPass.radius = 0;
  composer.addPass(bloomPass);
  const outputPass = new OutputPass();

  const pixelRatio = player.renderer!.getPixelRatio();

  const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
  composer.addPass(smaaPass);
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
  const url = '/models/steelmill/scene.glb';
  const loadmanager = THREE.DefaultLoadingManager;
  // loadmanager.onLoad=()
  const scene = await player.loader.loadFile(url, loadmanager);

  scene.name = 'steelmill';

  player.addObject(scene);
  // 加载hdr材质 并设置环境光贴图
  const rgbeLoader = new RGBELoader();
  const envMap = await rgbeLoader.loadAsync('/textures/skybox/industrial_sunset_02_puresky_4k.hdr ');
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // player.scene.background = envMap;
  player.scene.environment = envMap;

  // 创建弹窗的css2d模型
  // popoverObject = new CSS2DObject(popoverRef.value!);

  player.renderer!.toneMapping = THREE.ACESFilmicToneMapping;
  player.renderer!.toneMappingExposure = 1;
  player.renderer!.shadowMap.type = THREE.PCFSoftShadowMap;

  const arrowTexture = await new THREE.TextureLoader().loadAsync('/textures/arrow.svg');
  arrowTexture.needsUpdate = true;
  arrowTexture.repeat.x = 1;
  arrowTexture.wrapS = THREE.RepeatWrapping;
  arrowTexture.wrapT = THREE.RepeatWrapping;
  arrowTexture.colorSpace = THREE.SRGBColorSpace;
  player.scene.traverse((item) => {
    if (item instanceof THREE.Mesh && item.userData.name === 'Arrow') {
      item.position.y = 0.01;
      item.scale.set(5, 2, 1);
      item.material.transparent = true;
      (item.material as THREE.MeshBasicMaterial).map = arrowTexture;
      (item.material as THREE.MeshBasicMaterial).side = THREE.DoubleSide;
      return;
    }
    if (item.type == 'Mesh' || item.type == 'Bone') {
      item.castShadow = true;
      item.receiveShadow = true;
    }
    if (item instanceof THREE.Mesh) {
      item.material.envMap = envMap;
      item.material.envMapIntensity = 1;
      item.material.needsUpdate = true;
    }
  });

  player.events.update.add(({ delta }) => {
    // console.log('update', delta);
    arrowTexture.offset.x -= delta * 0.7;
    composer.render();
  });

  //播放动画
  const model = player.scene.getObjectByName('steelmill')!;
  const animations = model.animations;
  for (const ani of animations) {
    player.addAnimation(animations, ani.name, model);
  }
  // player.controls?.addEventListener('change', (ev) => {
  //   console.log('camera', ev.target.target, ev.target.object.position, player.camera!.position);
  // });
  player.camera!.position.set(49.08655711956998, 15.013313129229896, 29.585290041126118);
  player.controls?.saveState();
  player.play();

  loading.value = false;
});

function canSelect(object?: THREE.Object3D) {
  const intersectObjectsKey = equipmentInfos.value.map((v) => v.key);
  // equipmentInfos.value?.find((v) => v.key == object!.name || v.key == object?.userData.name);
  return object && intersectObjectsKey.includes(object?.name || object?.userData.name);
}
let chooseObject: THREE.Object3D | null = null;
function onSelected(object?: THREE.Object3D) {
  const selectObject = object; //(object as Object3DWrap).ancestors;
  // console.log('selectObject', selectObject);

  if (!selectObject || !canSelect(object)) {
    outlinePass.selectedObjects = [];
    chooseObject?.remove(popoverObject);
    chooseObject = null;
    player.events.objectSelected.dispatch(null);
    return;
  }
  chooseObject = selectObject;
  let current = equipmentInfos.value?.find((v) => v.key == selectObject.name);

  // console.log('outlinedObjects', outlinedObjects);
  outlinePass.selectedObjects = [selectObject];
  if (current) {
    selectedObjectInfo.value = {
      ...current,
    };
  }
  player.events.objectFocused.dispatch(selectObject);
}

const handleFocusTo = (focusKey: string) => {
  const object = player.scene.getObjectByName(focusKey);
  if (object) {
    onSelected(object);
  }
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
