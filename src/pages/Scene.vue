<template>
  <div id="scene" class="scene-container" ref="containerRef"></div>
</template>
<script setup lang="ts">
// import {
//   // Scene,
//   // PerspectiveCamera,
//   // AxesHelper,
//   WebGLRenderer,
//   // Camera,
//   // SRGBColorSpace,
//   // AmbientLight,
//   // Raycaster,
//   // Vector2,
// } from 'three';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { ref } from 'vue';
const containerRef = ref<HTMLElement>();
// const init = () => {};
// // 初始化渲染器
// const initRenderer = (el: HTMLElement) => {
//   // 初始化渲染器
//   const renderer = new WebGLRenderer({
//     logarithmicDepthBuffer: true,
//     antialias: true, // true/false表示是否开启反锯齿
//     alpha: true, // true/false 表示是否可以设置背景色透明
//     precision: 'mediump', // highp/mediump/lowp 表示着色精度选择
//     premultipliedAlpha: true, // true/false 表示是否可以设置像素深度（用来度量图像的分辨率）
//     // preserveDrawingBuffer: false, // true/false 表示是否保存绘图缓冲
//     // physicallyCorrectLights: true, // true/false 表示是否开启物理光照
//   });
// };
// const scene = new Scene();
</script>
<style lang="scss" scoped>
.scene-container {
  width: 100%;
  height: 100%;
}
</style>
