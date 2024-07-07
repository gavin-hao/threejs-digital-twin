import * as THREE from 'three';
export interface Updatable {
  key?: string;
  update(deltaTime: number): void;
}
const clock = new THREE.Clock();
class Loop {
  private _updatables: Updatable[];
  camera: THREE.Camera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  constructor(camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this._updatables = [];
  }
  get updatables(): Updatable[] {
    return this._updatables;
  }

  addUpdatables(...objects: Updatable[]) {
    for (const o of objects) {
      if (!o.key) {
        o.key = Math.random().toString(36).slice(-8);
      }
      this.updatables.push(o);
    }
  }
  start(onUpdate?: Updatable['update']) {
    if (onUpdate) {
      this.addUpdatables({ key: 'start__onUpdate', update: onUpdate });
    }
    //start render loop
    this.renderer.setAnimationLoop(() => {
      // render a frame
      this.renderer.render(this.scene, this.camera);
      // tell every animated object to tick forward one frame
      this.update();
    });
  }
  stop() {
    this.renderer.setAnimationLoop(null);
  }
  private update() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();

    // console.log(`The last frame rendered in ${delta * 1000} milliseconds`);

    for (const object of this.updatables) {
      object.update(delta);
    }
  }
}
export default Loop;
