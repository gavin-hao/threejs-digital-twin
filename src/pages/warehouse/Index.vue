<template>
  <LayoutScreen>
    <template #header>
      <Header>
        <div class="title">数字孪生平台</div>
      </Header>
    </template>

    <template #main>
      <div id="viewport" ref="viewport">
        <Progress v-if="loading" />
      </div>
    </template>
  </LayoutScreen>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Player } from '@/three';
import * as THREE from 'three';
import {
  EffectComposer,
  OutputPass,
  RenderPass,
  SMAAPass,
  RGBELoader,
  UnrealBloomPass,
} from 'three/examples/jsm/Addons.js';
import LayoutScreen from '@/pages/components/LayoutScreen.vue';
import Header from '@/pages/components/Header.vue';
import Progress from '@/components/Progress.vue';
const player = new Player();
const viewport = ref<HTMLElement>();
const loading = ref<boolean>(true);
let composer: EffectComposer;
onMounted(async () => {
  // intersectObjects = [];

  player.setSize(viewport.value!.offsetWidth, viewport.value!.offsetHeight);
  player.setPixelRatio(window.devicePixelRatio);
  // player.scene.fog = new THREE.Fog(0xcccccc, 2, 450);

  viewport.value!.appendChild(player.dom);

  // player.addCSS2DRenderer();
  // player.addCSS3Renderer();
  player.addControls();

  composer = new EffectComposer(player.renderer!);
  player.events.resize.add((width, height) => {
    composer.setSize(width, height);
  });

  const renderPass = new RenderPass(player.scene!, player.camera!);
  composer.addPass(renderPass);

  const pixelRatio = player.renderer!.getPixelRatio();
  // width、height是canva画布的宽高度
  const { offsetWidth: width, offsetHeight: height } = player.cavans;

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
  bloomPass.threshold = 1;
  bloomPass.strength = 0.5;
  bloomPass.radius = 0;
  composer.addPass(bloomPass);
  const outputPass = new OutputPass();
  const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
  composer.addPass(smaaPass);
  composer.addPass(outputPass);

  player.events.start.add(() => {
    console.log('start run play ');
  });

  loading.value = true;
  const url = '/models/warehouse2/scene.glb';
  const loadmanager = THREE.DefaultLoadingManager;
  // loadmanager.onLoad=()
  const scene = await player.loader.loadFile(url, loadmanager);

  player.addObject(scene);
  // 加载hdr材质 并设置环境光贴图
  const rgbeLoader = new RGBELoader();
  const envMap = await rgbeLoader.loadAsync('/textures/skybox/industrial_sunset_02_puresky_4k.hdr');
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  player.scene.background = envMap;
  player.scene.environment = envMap;
  player.scene.environmentIntensity = 1;
  // 创建弹窗的css2d模型
  // popoverObject = new CSS2DObject(popoverRef.value!);

  player.renderer!.toneMapping = THREE.ACESFilmicToneMapping;
  player.renderer!.toneMappingExposure = 1;
  player.renderer!.shadowMap.type = THREE.PCFSoftShadowMap;

  player.scene.traverse((item) => {
    console.log(item.name, item);
    if (item.type == 'Mesh' || item.type == 'Bone') {
      item.castShadow = true;
      item.receiveShadow = true;
    }
    if (item instanceof THREE.Mesh) {
      item.material.envMap = envMap;
      item.material.envMapIntensity = 0.7;
      item.material.needsUpdate = true;
    }
  });

  // const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  // directionalLight.position.set(60, 30, 40);
  // directionalLight.castShadow = true;
  // directionalLight.shadow.camera.left = -100;
  // directionalLight.shadow.camera.right = 100;
  // directionalLight.shadow.camera.top = 100;
  // directionalLight.shadow.camera.bottom = -100;
  // directionalLight.shadow.camera.near = 0.5;
  // directionalLight.shadow.camera.far = 100;
  // directionalLight.shadow.mapSize.set(1024, 1024);
  // directionalLight.shadow.radius = 2;
  // player.addObject(directionalLight);
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  player.addObject(ambientLight);
  const rectLight = new THREE.RectAreaLight(0xffffff, 1, 40, 8);
  rectLight.power = 3000;
  rectLight.castShadow = true;
  // rectLight.shadow.mapSize.set(1024, 1024);
  // rectLight.shadow.radius = 2;
  rectLight.position.set(0, 8, 0);
  rectLight.lookAt(0, 0, 0);
  player.addObject(rectLight);
  const rectLight2 = rectLight.clone();
  rectLight2.position.set(40, 8, 0);
  rectLight2.lookAt(40, 0, 0);
  player.addObject(rectLight2);
  const rectLight3 = rectLight.clone();
  rectLight3.position.set(60, 8, 0);
  rectLight3.lookAt(60, 0, 0);
  player.addObject(rectLight3);
  const rectLight4 = rectLight.clone();
  rectLight4.position.set(-30, 8, 0);
  rectLight4.lookAt(-30, 0, 0);
  player.addObject(rectLight4);
  const rectLight5 = rectLight.clone();
  rectLight5.position.set(-50, 8, 0);
  rectLight5.lookAt(-50, 0, 0);
  player.addObject(rectLight5);

  // initSky();
  player.controls?.addEventListener('change', (ev) => {
    const dis = player.controls?.getDistance();
    console.log('camera', dis, ev.target.object.position, player.camera!.position);
  });
  player.controls!.maxDistance = 100;
  player.controls!.minDistance = 2;
  player.controls!.maxPolarAngle = THREE.MathUtils.degToRad(90); //Math.PI / 2 ;
  player.controls!.minPolarAngle = THREE.MathUtils.degToRad(0);
  // player.controls!.maxAzimuthAngle = THREE.MathUtils.degToRad(30);
  // player.controls!.minAzimuthAngle = Math.PI / 2;

  player.controls!.update();
  player.camera!.position.set(-80.57485834297249, 7.603649398299234, 18.26664771648642);
  player.play();

  loading.value = false;
});

onUnmounted(() => {
  player?.dispose();
});
</script>
<style lang="scss">
#viewport {
  width: 100%;
  height: 100%;
}
</style>
