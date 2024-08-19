<template>
  <div id="viewport" ref="viewport">
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
    <div class="warning" ref="warnIconRef" v-show="false">
      <div class="warning-content">
        <img src="@/assets/images/warn_fill.svg" alt="warn" />
      </div>
    </div>
    <div class="progress" v-if="loading">
      <div class="progress-inner">
        <el-progress :percentage="50" :indeterminate="true" :show-text="false"> </el-progress>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElProgress } from 'element-plus';
import { Player } from '@/three';
import * as THREE from 'three';
import { Object3DWrap } from '@/hooks/useThree/Object3dWrap';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import {
  CSS2DObject,
  EffectComposer,
  OutlinePass,
  OutputPass,
  RenderPass,
  // SMAAPass,
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
const popoverRef = ref<HTMLElement>();
const warnIconRef = ref<HTMLElement>();
// let intersectObjects: Array<THREE.Object3D> = [];
let popoverObject: CSS2DObject;
const selectedObjectInfo = ref<{ [key: string]: unknown }>();
const context = useContext();
const loading = ref<boolean>(true);
const equipmentInfos = computed(() => {
  return [] as Array<any>;
});
let composer: EffectComposer, outlinePass: OutlinePass;
const effectParams = {
  edgeStrength: 30.0,
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

  viewport.value!.appendChild(player.dom);

  context.events.warn.add(showWarnIcon);
  context.events.focusTo.add(handleFocusTo);

  player.addCSS2DRenderer();
  player.addCSS3Renderer();
  player.addControls();
  player.addLight();

  const directionalLight = new THREE.DirectionalLight(0xffffff, 6);
  directionalLight.position.set(-11, 15, -25);
  directionalLight.castShadow = false;
  directionalLight.shadow.camera.left = -100;
  directionalLight.shadow.camera.right = 100;
  directionalLight.shadow.camera.top = 100;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.radius = 2;
  player.addLight(directionalLight);
  const ambientLight = new THREE.AmbientLight(0xfefefe, 1);
  // scene.value!.add(ambientLight);
  player.addLight(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
  hemisphereLight.position.set(0, 8, 0);
  player.addLight(hemisphereLight);
  // const lightPanel = gui.addFolder('PointLight');
  // lightPanel.add(directLight, 'intensity', 0, 50).name('intensity');
  // lightPanel.add(directLight, 'intensity', 0, 50).name('intensity');
  // lightPanel.add(directLight.position, 'x').name('position.x');
  // lightPanel.add(directLight.position, 'y').name('position.y');
  // lightPanel.add(directLight.position, 'z').name('position.z');
  // lightPanel.addColor(directLight, 'color').onChange(function (value) {
  //   directLight.color.set(value);
  // });
  if (process.env.NODE_ENV !== 'development') {
    gui.hide();
  }
  //Set up shadow properties for the light
  // pointLight.shadow.mapSize.width = 512; // default
  // pointLight.shadow.mapSize.height = 512; // default
  // pointLight.shadow.camera.near = 0.5; // default
  // pointLight.shadow.camera.far = 500; // default

  // player.addLight(directLight);
  player.scene.fog = new THREE.Fog(0xcccccc, 2, 350);
  composer = new EffectComposer(player.renderer!);
  player.events.resize.add((width, height) => {
    composer.setSize(width, height);
  });
  // player.camera?.lookAt(0, 0, 0);
  const renderPass = new RenderPass(player.scene!, player.camera!);
  composer.addPass(renderPass);
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
  const outputPass = new OutputPass();
  composer.addPass(outputPass);
  // const pixelRatio = player.renderer!.getPixelRatio();
  // // width、height是canva画布的宽高度
  // const { offsetWidth: width, offsetHeight: height } = player.cavans;
  // const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
  // composer.addPass(smaaPass);
  // 创建一个CSS3渲染器CSS3DRenderer
  const effectPanel = gui.addFolder('effect');
  effectPanel.add(effectParams, 'edgeStrength', 0.01, 50).onChange(function (value) {
    outlinePass.edgeStrength = Number(value);
  });

  effectPanel.add(effectParams, 'edgeGlow', 0.0, 1).onChange(function (value) {
    outlinePass.edgeGlow = Number(value);
  });

  effectPanel.add(effectParams, 'edgeThickness', 1, 50).onChange(function (value) {
    outlinePass.edgeThickness = Number(value);
  });

  effectPanel.add(effectParams, 'pulsePeriod', 0, 5).onChange(function (value) {
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

  player.events.start.add(() => {
    console.log('start run play ');
  });
  player.events.update.add(() => {
    // console.log('compser render', composer.passes);
    composer.render();
  });

  player.events.objectSelected.add((obj: THREE.Object3D) => {
    if (obj) {
      const selectObject = (obj as Object3DWrap).ancestors;
      onSelected(selectObject);
    }
  });
  loading.value = true;
  const url = '/models/steelmill/scene.glb';
  const loadmanager = THREE.DefaultLoadingManager;
  // loadmanager.onLoad=()
  const scene = await player.loader.loadFile(url, loadmanager);

  // scene.traverse((item) => {
  // console.log(item);
  // if (!(item instanceof THREE.Object3D)) {
  //   return;
  // }
  // if (isZhusuji(item) || isChongyaji(item) || isKongyaji(item) || isBofenghan(item)) {
  //   for (let i = 0; i < item.children.length; i++) {
  //     const group = item.children[i];
  //     //递归遍历chooseObj，并给chooseObj的所有子孙后代设置一个ancestors属性指向自己
  //     group.traverse(function (obj) {
  //       if (obj instanceof THREE.Mesh) {
  //         (obj as Object3DWrap).ancestors = item;
  //       }
  //     });
  //   }
  //   intersectObjects.push(item);
  // }
  // });
  scene.name = 'steelmill';
  // console.log('loaded scene', scene, intersectObjects);
  // const radiansPerSecond = THREE.MathUtils.degToRad(30);
  player.addObject(scene);

  //播放动画
  const model = player.scene.getObjectByName('steelmill')!;
  const animations = model.animations;
  for (const ani of animations) {
    player.addAnimation(animations, ani.name, model);
  }

  // 创建弹窗的css2d模型
  popoverObject = new CSS2DObject(popoverRef.value!);
  player.renderer!.toneMapping = THREE.ACESFilmicToneMapping;
  player.renderer!.toneMappingExposure = 0.5;
  player.renderer!.shadowMap.type = THREE.VSMShadowMap;
  player.scene.traverse((item) => {
    console.log(item.name, item);
    if (item.type == 'Mesh' || item.type == 'Bone') {
      item.castShadow = true;
      item.receiveShadow = true;
    }
  });
  player.play();

  loading.value = false;
});
// const isZhusuji = (object: THREE.Object3D) => {
//   return object.name?.includes('zhusuji_');
// };
// const isChongyaji = (object: THREE.Object3D) => {
//   return object.name?.includes('chongyaji_');
// };
// const isKongyaji = (object: THREE.Object3D) => {
//   return object.name?.includes('kongyaji_');
// };
// const isBofenghan = (object: THREE.Object3D) => {
//   return object.name?.includes('bofenghan_');
// };
let chooseObject: THREE.Object3D | null = null;
function onSelected(object?: THREE.Object3D) {
  const selectObject = object; //(object as Object3DWrap).ancestors;
  console.log('selectObject', selectObject);
  if (!selectObject) {
    outlinePass.selectedObjects = [];
    chooseObject?.remove(popoverObject);
    chooseObject = null;
    player.events.objectSelected.dispatch(null);
    return;
  }
  popoverObject.name = 'tag_' + selectObject.name;
  popoverObject.center.set(-0.1, 1.1);
  selectObject.add(popoverObject);
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

function createWarnTag(name: string) {
  const icon = warnIconRef.value!.cloneNode(true);

  const tag = new CSS3DObject(icon as HTMLElement);
  tag.name = 'tag_warn__' + name;

  player.events.update.add(() => {
    tag.lookAt(player.camera!.position.clone());
  });
  tag.scale.set(0.05, 0.05, 0.05);
  return tag;
}
const showWarnIcon = (errors: Array<Record<string, any>>) => {
  player.scene.traverse((item) => {
    if (item.name.includes('tag_warn__')) {
      item.visible = false;
    }
  });

  for (let i in errors) {
    let target = player.scene.getObjectByName(errors[i].key);

    if (target) {
      const existIcon = target.getObjectByName('tag_warn__' + target.name);
      if (existIcon) {
        existIcon.visible = true;
      } else {
        let label = createWarnTag(target.name);

        const box = new THREE.Box3().setFromObject(target);
        //
        const size = box.getSize(new THREE.Vector3());
        // const center = box.getCenter(new THREE.Vector3());
        label.position.y = size.y;
        label.translateY(0.2);
        // console.log('xxxx---', size, center);
        target.add(label);
      }
    }
  }
};
const handleFocusTo = (focusKey: string) => {
  const object = player.scene.getObjectByName(focusKey);
  if (object) {
    onSelected(object);
  }
};
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
