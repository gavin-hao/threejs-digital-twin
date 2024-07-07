import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import TWEEN, { Easing } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as ThreeBase from './core';
import Loop, { type Updatable } from './loop';
import { throttle } from 'lodash';

const events = <const>['click', 'dblclick', 'pointermove'];
type EventMap = (typeof events)[number];

const useThree = () => {
  const containerEl = ref<HTMLElement>();
  const scene = shallowRef<THREE.Scene>();
  const camera = shallowRef<THREE.Camera>();
  const renderer = shallowRef<THREE.WebGLRenderer>();
  const cssRenderer = shallowRef<CSS2DRenderer>();

  const controls = shallowRef<OrbitControls>();
  const mixers: THREE.AnimationMixer[] = [];
  const resizeListener: Array<() => void> = [];
  // let raycaster: THREE.Raycaster, pointer: THREE.Vector2;
  let loop: Loop;
  const resizeObserver = new ResizeObserver(() => {
    setSize(containerEl.value!, camera.value!, renderer.value!, cssRenderer.value);
    resizeListener.forEach((func) => {
      func?.();
    });
  });
  const onResize = (callback: () => void) => {
    resizeListener.push(callback);
  };
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
    loop.addUpdatables(controls.value!, {
      key: 'cssRenderer loop',
      update: () => {
        // console.log(`The last frame rendered in ${delta * 1000} milliseconds,run 'cssRenderer loop'`);
        cssRenderer.value!.render(scene.value!, camera.value!);
      },
    });
    loop.start((deltaTime) => {
      onUpdate?.(deltaTime);
      TWEEN.update();
    });
  };
  const focus = (target: THREE.Object3D) => {
    const pos = new THREE.Vector3();
    target.getWorldPosition(pos);
    // 相机飞行到的位置和观察目标拉开一定的距离
    const pos2 = pos.clone().addScalar(16);

    // const box = new THREE.Box3();
    // const center = new THREE.Vector3();
    // const sphere = new THREE.Sphere();
    // const delta = new THREE.Vector3();
    // const quaternion = new THREE.Quaternion();

    // box.setFromObject(target);
    // box.getCenter(center);
    // target.getWorldQuaternion(quaternion);

    createCameraTween(pos2, pos);
  };

  /**
   * 相机动画函数，从A点飞行到B点，A点表示相机当前所处状态
   * @param endPos {THREE.Vector3} 表示动画结束相机位置
   * @param endTarget {THREE.Vector3} 表示相机动画结束lookAt指向的目标观察点
   */
  function createCameraTween(endPos: THREE.Vector3, endTarget: THREE.Vector3) {
    const cameraStartPos = camera.value!.position;
    const controlsPos = controls.value!.target;
    console.log('createCameraTween', cameraStartPos, controlsPos, endPos, endTarget);
    new TWEEN.Tween({
      // 不管相机此刻处于什么状态，直接读取当前的位置和目标观察点
      x: cameraStartPos.x,
      y: cameraStartPos.y,
      z: cameraStartPos.z,
      tx: controlsPos.x,
      ty: controlsPos.y,
      tz: controlsPos.z,
    })
      .to(
        {
          // 动画结束相机位置坐标
          x: endPos.x,
          y: endPos.y,
          z: endPos.z,
          // 动画结束相机指向的目标观察点
          tx: endTarget.x,
          ty: endTarget.y,
          tz: endTarget.z,
        },
        1000
      )
      .easing(Easing.Quadratic.Out)
      .onUpdate(function (obj) {
        // 动态改变相机位置
        camera.value!.position.set(obj.x, obj.y, obj.z);
        // 动态计算相机视线
        // camera.lookAt(obj.tx, obj.ty, obj.tz);
        controls.value!.target.set(obj.tx, obj.ty, obj.tz);
        controls.value!.update(); //内部会执行.lookAt()
      })
      .start();
  }
  const addEventListener = (
    eventName: EventMap,
    handler: (inersectObjects: THREE.Intersection[]) => void,
    objects?: THREE.Object3D<THREE.Object3DEventMap>[]
  ) => {
    const throttleFunc = throttle((event: MouseEvent | PointerEvent) => {
      const px = event.offsetX;
      const py = event.offsetY;
      const { offsetWidth: width, offsetHeight: height } = renderer.value!.domElement!;
      const x = (px / width) * 2 - 1;
      const y = -(py / height) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      pointer.set(x, y);
      raycaster.setFromCamera(pointer, camera.value!);
      if (!objects) {
        objects = [];
      }
      const intersects = raycaster.intersectObjects(objects, true);
      handler(intersects);
    }, 50);
    cssRenderer.value!.domElement.addEventListener<EventMap>(eventName, throttleFunc);
  };
  const dispose = () => {
    controls.value?.dispose();
    loop.stop();
    scene.value?.clear();
    renderer.value?.forceContextLoss();
    renderer.value?.dispose();
    resizeObserver.disconnect();
  };
  onUnmounted(() => {
    dispose();
  });
  const onclick = (
    objects: THREE.Object3D<THREE.Object3DEventMap>[],
    handler: (inersectObjects: THREE.Intersection[]) => void
  ) => {
    addEventListener('click', handler, objects);
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
    onclick,
    addEventListener,
    onResize,
    focus,
  };
};
export default useThree;

export { loadGLTF } from './modelLoader';
export { initStats } from './core';
export * from './utils';
export * from './Object3dWrap';
