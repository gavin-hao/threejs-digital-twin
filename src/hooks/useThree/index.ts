import { onMounted, ref, shallowRef } from 'vue';
// import { isFunction } from 'lodash';
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as ThreeBase from './core';
import Loop, { type Updatable } from './loop';
const useThree = () => {
  const containerEl = ref<HTMLElement>();
  const scene = shallowRef<THREE.Scene>();
  const camera = shallowRef<THREE.Camera>();
  const renderer = shallowRef<THREE.WebGLRenderer>();
  const cssRenderer = shallowRef<CSS2DRenderer>();
  const controls = shallowRef<OrbitControls>();
  const mixers: THREE.AnimationMixer[] = [];

  let loop: Loop;
  const resizeObserver = new ResizeObserver(() => {
    setSize(containerEl.value!, camera.value!, renderer.value!, cssRenderer.value);
  });
  onMounted(() => {
    init();
    resizeObserver.observe(containerEl.value!);
  });
  const init = () => {
    const el = containerEl.value as HTMLElement;
    if (el.clientHeight === 0 || el.clientWidth === 0) {
      throw new Error('element should had width and height before init.');
    }
    scene.value = ThreeBase.initScene();
    camera.value = ThreeBase.initCamera(el);
    renderer.value = ThreeBase.initRenderer(el);
    cssRenderer.value = ThreeBase.initCSSRender(el);
    controls.value = ThreeBase.initControls(camera.value, cssRenderer.value!.domElement);
    loop = new Loop(camera.value, scene.value, renderer.value);
  };
  const setSize = (
    container: HTMLElement,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    cssRenderer?: CSS2DRenderer
  ) => {
    if (!container || !camera || !renderer || !cssRenderer) {
      return;
    }
    const { clientHeight, clientWidth } = container;
    if (clientHeight === 0 || clientWidth === 0) {
      throw new Error('element should had width and height before init.');
    }
    console.log('camera.type', camera.type);
    if (camera.type === 'PerspectiveCamera') {
      (camera as THREE.PerspectiveCamera).aspect = clientWidth / clientHeight;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }

    renderer?.setSize(clientWidth, clientHeight);
    renderer?.setPixelRatio(window.devicePixelRatio);
    cssRenderer?.setSize(clientWidth, clientHeight);
  };

  const render = (onUpdate?: Updatable['update']) => {
    // const mixerUpdateDelta = clock.getDelta();
    // mixers.forEach((mixer) => mixer.update(mixerUpdateDelta));
    // composers.forEach((composer) => composer.render(delta));
    // renderMixins.forEach((mixin) => isFunction(mixin) && mixin());
    // TWEEN.update();
    // renderer.value!.setAnimationLoop(() => {
    //   cssRenderer.value?.render(scene.value!, camera.value!);
    //   renderer.value!.render(scene.value!, camera.value!);
    //   stats?.update();
    //   controls.value?.update();
    // });
    loop.addUpdatables(controls.value!, {
      key: 'cssRenderer loop',
      update: () => {
        // console.log(`The last frame rendered in ${delta * 1000} milliseconds,run 'cssRenderer loop'`);
        cssRenderer.value!.render(scene.value!, camera.value!);
      },
    });
    loop.start((deltaTime) => {
      onUpdate?.(deltaTime);
      TWEEN.update(deltaTime);
    });
  };

  const distroy = () => {
    loop.stop();
    resizeObserver.disconnect();
  };
  /**
   * 加载模型动画
   * @param mesh
   * @param animations
   * @param animationName
   * @returns
   */
  const loadAnimate = (
    mesh: THREE.Mesh | THREE.AnimationObjectGroup | THREE.Group,
    animations: Array<THREE.AnimationClip>,
    animationName: string
  ) => {
    const mixer = new THREE.AnimationMixer(mesh);
    const clip = THREE.AnimationClip.findByName(animations, animationName);
    if (!clip) return undefined;
    const action = mixer.clipAction(clip);
    action.play();
    mixers.push(mixer);
  };

  // const addStats = () => {};
  return {
    render,
    loadAnimate,
    scene,
    camera,
    renderer,
    controls,
    containerEl,
    cssRenderer,
    distroy,
  };
};
export default useThree;

export { loadGLTF } from './modelLoader';
export { initStats } from './core';
