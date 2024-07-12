import * as THREE from 'three';
import signals, { Signal } from 'signals';
import Loader from './loader';
import { CSS2DRenderer, CSS3DRenderer } from 'three/examples/jsm/Addons.js';
import PlayerControls from './controls';
import Selector from './selector';
import TWEEN from '@tweenjs/tween.js';

// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

const _DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
_DEFAULT_CAMERA.name = 'Camera';
_DEFAULT_CAMERA.position.set(0, 5, 10);
_DEFAULT_CAMERA.lookAt(new THREE.Vector3());

let time: number, startTime: number, prevTime: number;
const clock = new THREE.Clock();
// type EventListenerHandler = (...params: any[]) => void;
type Events = {
  init: Signal<any>;
  start: Signal<any>;
  stop: Signal<any>;
  keydown: Signal<any>;
  keyup: Signal<any>;
  pointerdown: Signal<any>;
  pointerup: Signal<any>;
  pointermove: Signal<any>;
  update: Signal<any>;
  resize: Signal<any>;
  intersectionsDetected: Signal<any>;
  objectFocused: Signal<any>;
  objectSelected: Signal<any>;
};
export class Player {
  width: any;
  height: any;
  dom: HTMLElement;
  renderer?: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera?: THREE.Camera;
  loader: Loader;
  private resizeObserver: ResizeObserver;
  selector: Selector;
  controls?: PlayerControls;
  private mixers: THREE.AnimationMixer[] = [];

  constructor() {
    this.dom = document.createElement('div');
    this.dom.id = 'player';

    this.loader = new Loader();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.localClippingEnabled = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.clearDepth();

    this.dom.appendChild(this.renderer.domElement);
    //set camera
    this.setCamera(_DEFAULT_CAMERA.clone());
    // init scene
    this.scene = new THREE.Scene();
    this.scene.name = 'Scene';
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.onResize(width, height);
    });
    this.resizeObserver.observe(this.dom);
    this.selector = new Selector(this);
    this.events.objectFocused.add((object) => {
      this.controls?.focus(object);
    });
  }

  private onResize(width: number, height: number) {
    this.setSize(width, height);
    this.setPixelRatio(window.devicePixelRatio);

    this.events.resize.dispatch(width, height);
  }
  private _events: Events = {
    init: new signals.Signal(),
    start: new signals.Signal(),
    stop: new signals.Signal(),
    keydown: new signals.Signal(),
    keyup: new signals.Signal(),
    pointerdown: new signals.Signal(),
    pointerup: new signals.Signal(),
    pointermove: new signals.Signal(),
    update: new signals.Signal(),
    resize: new signals.Signal(),
    intersectionsDetected: new signals.Signal(),
    objectFocused: new signals.Signal(),
    objectSelected: new signals.Signal(),
  };
  get events() {
    return this._events;
  }
  get cavans() {
    return this.renderer!.domElement;
  }

  public addAnimation(animations: Array<THREE.AnimationClip>, animationName: string, target: THREE.Object3D) {
    const mixer = new THREE.AnimationMixer(target);
    const clip = THREE.AnimationClip.findByName(animations, animationName);
    if (!clip) return undefined;
    const action = mixer.clipAction(clip);
    action.play();
    this.mixers.push(mixer);
  }
  public addAnimationMixer(mixer: THREE.AnimationMixer) {
    this.mixers.push(mixer);
  }
  public addCSS2DRenderer() {
    const CSSRenderer = new CSS2DRenderer();
    CSSRenderer.setSize(this.width, this.height);
    CSSRenderer.domElement.style.position = 'absolute';
    CSSRenderer.domElement.style.top = '0px';
    CSSRenderer.domElement.style.pointerEvents = 'none';
    this.dom.appendChild(CSSRenderer.domElement);

    this.events.update.add(() => {
      CSSRenderer.render(this.scene, this.camera!);
    });
    this.events.resize.add((width, height) => {
      CSSRenderer.setSize(width, height);
    });
    return this;
  }
  public addCSS3Renderer() {
    const css3Renderer = new CSS3DRenderer();
    css3Renderer.setSize(this.width, this.height);
    // HTML标签<div id="tag"></div>外面父元素叠加到canvas画布上且重合
    css3Renderer.domElement.style.position = 'absolute';
    css3Renderer.domElement.style.top = '0px';
    //设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
    css3Renderer.domElement.style.pointerEvents = 'none';
    this.dom.appendChild(css3Renderer.domElement);
    this.events.update.add(() => {
      css3Renderer.render(this.scene, this.camera!);
    });
    this.events.resize.add((width, height) => {
      css3Renderer.setSize(width, height);
    });
  }
  public setCamera(value: THREE.Camera) {
    this.camera = value;
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }
  }
  public addControls() {
    this.controls = new PlayerControls(this.camera!, this.cavans);
    this.events.update.add(() => {
      this.controls?.update();
    });
  }
  public setScene(scene: THREE.Scene) {
    // this.scene = value;
    this.scene.background = scene.background;
    this.scene.environment = scene.environment;
    this.scene.fog = scene.fog;
    this.scene.backgroundBlurriness = scene.backgroundBlurriness;
    this.scene.backgroundIntensity = scene.backgroundIntensity;

    this.scene.userData = JSON.parse(JSON.stringify(scene.userData));
    while (scene.children.length > 0) {
      this.addObject(scene.children[0]);
    }
  }
  public setPixelRatio(pixelRatio: number) {
    this.renderer?.setPixelRatio(pixelRatio);
  }
  public setSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    if (this.camera && this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }

    this.renderer?.setSize(width, height);
  }

  public addLight(light?: THREE.Light) {
    if (light) {
      this.addObject(light);
      return this;
    }
    const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
    directionalLight.position.set(3, 15, 18);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.radius = 2;
    this.addObject(directionalLight);
    const ambientLight = new THREE.AmbientLight(0xfefefe, 0.8);
    // scene.value!.add(ambientLight);
    this.addObject(ambientLight);
    return this;
  }

  public addGridHelpers() {
    // helpers
    const GRID_COLORS_LIGHT = [0x999999, 0x777777];
    // const GRID_COLORS_DARK = [0x555555, 0x888888];

    const grid = new THREE.Group();

    const grid1 = new THREE.GridHelper(30, 30);
    grid1.material.color.setHex(GRID_COLORS_LIGHT[0]);
    grid1.material.vertexColors = false;
    grid.add(grid1);

    const grid2 = new THREE.GridHelper(30, 6);
    grid2.material.color.setHex(GRID_COLORS_LIGHT[1]);
    grid2.material.vertexColors = false;
    grid.add(grid2);
    this.events.update.add(() => {
      this.renderer?.render(grid, this.camera!);
    });
  }
  public addObject(object: THREE.Object3D, parent?: THREE.Object3D, index?: number) {
    if (parent === undefined) {
      this.scene?.add(object);
    } else {
      parent.children.splice(index || 0, 0, object);
      object.parent = parent;
    }
  }
  public play() {
    const animate = () => {
      time = performance.now();
      this.renderer?.render(this.scene!, this.camera!);

      try {
        this.events.update.dispatch({ time: time - startTime, delta: time - prevTime });
        const delta = clock.getDelta();
        for (const mixer of this.mixers) {
          mixer.update(delta);
        }
        TWEEN.update();
      } catch (e: any) {
        console.error(e.message || e, e.stack || '');
      }

      prevTime = time;
    };

    startTime = prevTime = performance.now();

    this.dom.addEventListener('click', this.onClick.bind(this));

    this.events.start.dispatch();

    this.renderer!.setAnimationLoop(animate);
  }
  public render(time?: number) {
    performance.now();
    this.events.update.dispatch({ time: time || 0 * 1000, delta: 0 /* TODO */ });
    this.renderer!.render(this.scene!, this.camera!);
  }
  public stop() {
    this.dom.removeEventListener('click', this.onClick.bind(this));

    this.events.stop.dispatch();

    this.renderer?.setAnimationLoop(null);
  }
  public dispose() {
    this.stop();
    this.renderer?.dispose();

    this.camera = undefined;
  }
  private getMousePosition(dom: HTMLElement, x: number, y: number) {
    const rect = dom.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  }

  // private onDoubleClickPosition = new THREE.Vector2();
  // private onDoubleClick(event: MouseEvent) {
  //   const array = this.getMousePosition(this.dom, event.clientX, event.clientY);
  //   this.onDoubleClickPosition = new THREE.Vector2().fromArray(array);
  //   const intersects = this.selector.getPointerIntersects(this.onDoubleClickPosition, this.camera!);

  //   if (intersects.length > 0) {
  //     const intersect = intersects[0];
  //     this.events.objectFocused.dispatch(intersect.object);

  //   }
  // }
  private onClick(event: MouseEvent) {
    const array = this.getMousePosition(this.dom, event.clientX, event.clientY);
    const clickPosition = new THREE.Vector2().fromArray(array);
    const intersects = this.selector.getPointerIntersects(clickPosition, this.camera!);
    this.events.intersectionsDetected.dispatch(intersects);
  }
}
