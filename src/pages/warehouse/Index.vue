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
import { EffectComposer, OutputPass, RenderPass, SMAAPass, RGBELoader } from 'three/examples/jsm/Addons.js';
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
  //#region outlinePass
  // outlinePass = new OutlinePass(
  //   new THREE.Vector2(player.cavans.clientWidth, player.cavans.clientHeight),
  //   player.scene,
  //   player.camera!
  // );
  // outlinePass.visibleEdgeColor.set(effectParams.visibleEdgeColor);
  // outlinePass.hiddenEdgeColor.set(effectParams.hiddenEdgeColor);
  // outlinePass.pulsePeriod = effectParams.pulsePeriod;
  // outlinePass.edgeGlow = effectParams.edgeGlow;
  // outlinePass.edgeThickness = effectParams.edgeThickness;
  // outlinePass.edgeStrength = effectParams.edgeStrength;
  // composer.addPass(outlinePass);
  const outputPass = new OutputPass();
  composer.addPass(outputPass);
  const pixelRatio = player.renderer!.getPixelRatio();
  // width、height是canva画布的宽高度
  const { offsetWidth: width, offsetHeight: height } = player.cavans;
  const smaaPass = new SMAAPass(width * pixelRatio, height * pixelRatio);
  composer.addPass(smaaPass);

  //#endregion
  player.events.start.add(() => {
    console.log('start run play ');
  });

  loading.value = true;
  const url = '/models/warehouse/scene.glb';
  const loadmanager = THREE.DefaultLoadingManager;
  // loadmanager.onLoad=()
  const scene = await player.loader.loadFile(url, loadmanager);

  player.addObject(scene);
  // 加载hdr材质 并设置环境光贴图
  const rgbeLoader = new RGBELoader();
  const envMap = await rgbeLoader.loadAsync('/textures/skybox/clarens_midday_2k.hdr');
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  player.scene.background = envMap;
  player.scene.environment = envMap;

  // 创建弹窗的css2d模型
  // popoverObject = new CSS2DObject(popoverRef.value!);

  player.renderer!.toneMapping = THREE.NeutralToneMapping;
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
      item.material.envMapIntensity = 1;
      item.material.needsUpdate = true;
    }
  });

  player.events.update.add(({ delta: _delta }) => {
    // console.log('update', delta);
    composer.render();
  });

  // player.controls?.addEventListener('change', (ev) => {
  //   const dis = player.controls?.getDistance();
  //   console.log('camera', dis, ev.target.object.position, player.camera!.position);
  // });
  player.controls!.maxDistance = 80;
  player.camera!.position.set(44.46365982107533, 14.053705443625564, 39.61480688621657);
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
