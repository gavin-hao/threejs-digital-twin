<template>
  <div id="popover-viewport" ref="viewport" :style="{ width: `${width}px`, height: `${height}px` }"></div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { Player } from '@/three';
import * as THREE from 'three';
import {
  // CSS2DObject,
  EffectComposer,
  OutputPass,
  RenderPass,
  SMAAPass,
  RoomEnvironment,
  // ShaderPass,
  // GammaCorrectionShader,
} from 'three/examples/jsm/Addons.js';
import equips from '../data/steelmill';
import { useElementSize } from '@vueuse/core';
const equipmentInfos = ref([
  equips.Bianqieji,
  equips.Cuzhaji,
  equips.Dianhulu,
  equips.Duanqieji,
  // equips.Gaolu,
  equips.Jiarelu,
  equips.Jingzhaji,
  equips.Lianzhu,
  equips.Panjuanji,
  equips.Tieshuiguan,
  equips.Zhengpingji,
  equips.Zhongzhaji,
  equips.Zhuanlu,
  equips.Zhuzhaji,
]);
const modelNames = computed(() => {
  return equipmentInfos.value.map((v) => v.key).filter((v) => v !== 'GaoLu');
});

let models: THREE.Group<THREE.Object3DEventMap>[] = [];

const player = new Player();
const viewport = ref<HTMLElement>();

let composer: EffectComposer;
let pmremGenerator: THREE.PMREMGenerator;
const props = defineProps<{
  modelName?: string;
  width?: number;
  height?: number;
  visible?: boolean;
  // models: THREE.Group<THREE.Object3DEventMap>[];
}>();

const { width: offsetWidth, height: offsetHeight } = useElementSize(viewport);
watchEffect(() => {
  if (offsetWidth.value > 0 && offsetHeight.value > 0) {
    // console.log('setSize', offsetWidth.value, offsetHeight.value);
    // player.renderer?.clear();

    player.setSize(offsetWidth.value, offsetHeight.value);
  }
});
watchEffect(
  () => {
    if (props.visible) {
      player.controls?.reset(false);
      visibleModel(props.modelName);
      player.play();
    } else {
      player.stop();
    }
  },
  { flush: 'post' }
);
async function loadModels() {
  const tasks = modelNames.value.map((name) => async () => {
    const glb = await player.loader.loadFile(`/models/steelmill2/${name}.glb`);
    glb.name = name;
    glb.userData.name = name;
    return glb;
  });

  models = await Promise.all(tasks.map((task) => task()));
}
function visibleModel(name?: string) {
  models.forEach((model) => {
    if (model.name === name) {
      // console.log('visible', name, model);

      model.visible = true;
      const focusObject = player.scene.getObjectByName(props.modelName || '');
      let scalar = 1.5;
      // if (name === 'Dianhulu') {
      //   scalar = 1.5;
      // }
      // if (name === 'Lianzhu') {
      //   scalar = 1.5;
      // }
      // if (name === 'Zhongzhaji') {
      //   scalar = 1.2;
      // }
      // if (name === 'Bianqieji') {
      //   scalar = 1.6;
      // }
      // if (name === 'Zhengpingji') {
      //   scalar = 1.5;
      // }
      // if (name === 'Cuzhaji') {
      //   scalar = 1.2;
      // }
      // if (name === 'Jiarelu') {
      //   scalar = 1.5;
      // }
      // if (name === 'zhuan_lu') {
      //   scalar = 1.2;
      // }
      // if (name === 'Zhuzhaji') {
      //   scalar = 1.2;
      // }
      // if (name === 'Jingzhaji') {
      //   scalar = 1.4;
      // }
      // if (name === 'Duanqieji') {
      //   scalar = 1.2;
      // }
      if (focusObject) {
        player.controls?.focus(focusObject, { scalar });
      }
      // player.controls?.reset();
      // player.controls?.focus2(model);
    } else {
      model.visible = false;
    }
  });
}
onMounted(async () => {
  // console.log('viewport', viewport.value?.offsetHeight);
  player.setSize(props.width || viewport.value!.offsetWidth, props.height || viewport.value!.offsetHeight);
  player.setPixelRatio(window.devicePixelRatio);
  player.scene.fog = new THREE.Fog(0xcccccc, 2, 450);

  viewport.value!.appendChild(player.dom);
  player.addControls();
  // const grid = new THREE.GridHelper(30, 15, 0xcccccc, 0x999999);
  // player.scene.add(grid);
  // ground
  // {
  //   const ground = new THREE.Mesh(
  //     new THREE.PlaneGeometry(30, 30, 1, 1),
  //     new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150 })
  //   );

  //   ground.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
  //   ground.receiveShadow = true;
  //   player.scene.add(ground);
  // }
  // Lights
  {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    // ambientLight.layers.set(1);
    player.scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 80);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.2;
    spotLight.position.set(0, 8, 3);
    spotLight.castShadow = false;
    spotLight.shadow.camera.near = 3;
    spotLight.shadow.camera.far = 30;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    // spotLight.layers.set(1);
    player.scene.add(spotLight);
    // player.addObject(new THREE.SpotLightHelper(spotLight));

    const dirLight = new THREE.DirectionalLight(0x55505a, 4);
    dirLight.position.set(0, 8, 3);
    dirLight.castShadow = false;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 10;

    dirLight.shadow.camera.right = 1;
    dirLight.shadow.camera.left = -1;
    dirLight.shadow.camera.top = 1;
    dirLight.shadow.camera.bottom = -1;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    // dirLight.layers.set(1);
    player.scene.add(dirLight);
  }
  // composer
  {
    composer = new EffectComposer(player.renderer!);
    const renderPass = new RenderPass(player.scene!, player.camera!);
    composer.addPass(renderPass);
    const { offsetWidth: width, offsetHeight: height } = player.cavans;

    const pixelRatio = player.renderer!.getPixelRatio();

    const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
    composer.addPass(smaaPass);
    // // 创建伽马校正通道
    // const gammaPass = new ShaderPass(GammaCorrectionShader);
    // composer.addPass(gammaPass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
  }

  await loadModels();
  models.forEach((model) => {
    model.scale.multiplyScalar(0.4);

    player.addObject(model);
    if (['zhuan_lu', 'Jingzhaji'].includes(model.name)) {
      const animations = model.animations;
      for (const ani of animations) {
        player.addAnimation(animations, ani.name, model);
      }
    }
    // console.log('model', model.name, model);
  });
  // player.scene.traverse((item) => {
  //   if (item.type === 'Group') {
  //     console.log(item.name, item);
  //   }
  // });

  // player.controls?.addEventListener('change', (ev) => {
  //   console.log('camera', ev.target.target, ev.target.object.position, player.camera!.position);
  // });
  player.controls!.autoRotate = true;
  player?.camera?.position.set(8.434432723983832, 9.526646692338861, 6.038920583677303);
  player.controls?.saveState();

  player.enableShadows();
  visibleModel(props.modelName);
  // const focusObject = player.scene.getObjectByName(props.modelName || '');
  // if (focusObject) {
  //   player.controls?.focus2(focusObject,);
  // }
  pmremGenerator = new THREE.PMREMGenerator(player.renderer!);
  pmremGenerator.compileEquirectangularShader();
  player.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04, 0.01, 20).texture;
  player.events.resize.add((width, height) => {
    composer.setSize(width, height);
  });
  player.events.update.add((_timer) => {
    composer.render();
  });
  player.events.stop.add(() => {
    // console.log('player.events.stop in scene2.vue');
  });
  player.events.start.add(() => {
    // console.log('player.events.start in scene2.vue');
  });
  // player.play();
});
onUnmounted(() => {
  pmremGenerator?.dispose();
  composer?.dispose();
  player.dispose();
});
</script>
<style lang="scss" scoped>
#popover-viewport {
  width: 100%;
  height: 100%;
  // backdrop-filter: blur(5px);
}
</style>
