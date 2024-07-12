import { OrbitControls } from 'three/examples/jsm/Addons.js';
import TWEEN, { Easing } from '@tweenjs/tween.js';
import * as THREE from 'three';
class PlayerControls extends THREE.EventDispatcher {
  private object: THREE.Camera;
  private domElement: HTMLElement;
  private orbitControls: OrbitControls;
  center = new THREE.Vector3();
  constructor(object: THREE.Camera, domElement: HTMLElement) {
    super();
    this.object = object;
    this.domElement = domElement;
    this.orbitControls = new OrbitControls(this.object, this.domElement);
    this.orbitControls.minDistance = 5;
    this.orbitControls.maxDistance = 100;
    this.orbitControls.enableDamping = true; //启用阻尼
    this.addDomEvents();
  }
  private addDomEvents() {
    this.domElement.addEventListener('click', this.onClick);
    this.domElement.addEventListener('pointermove', this.onPointerMove);
    this.domElement.addEventListener('dblclick', this.onDoubleClick);
  }
  // private getMousePosition(dom: HTMLElement, x: number, y: number) {
  //   const rect = dom.getBoundingClientRect();
  //   return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  // }
  private onClick(_event: MouseEvent) {
    // const array = this.getMousePosition(this.domElement, event.clientX, event.clientY);
    // onDoubleClickPosition.fromArray(array);
    // const intersects = selector.getPointerIntersects(onDoubleClickPosition, camera);
    // if (intersects.length > 0) {
    //   const intersect = intersects[0];
    //   // signals.objectFocused.dispatch(intersect.object);
    // }
  }
  private onDoubleClick() {}
  private onPointerMove() {}
  public update(time?: { time: number; delta: number }) {
    this.orbitControls.update(time?.delta);
  }

  public focus(target: THREE.Object3D) {
    const pos = new THREE.Vector3();
    target.getWorldPosition(pos);
    // 相机飞行到的位置和观察目标拉开一定的距离
    const pos2 = pos.clone().addScalar(8);

    // const box = new THREE.Box3();
    // const center = new THREE.Vector3();
    // const sphere = new THREE.Sphere();
    // const delta = new THREE.Vector3();
    // const quaternion = new THREE.Quaternion();

    // box.setFromObject(target);
    // box.getCenter(center);
    // target.getWorldQuaternion(quaternion);

    this.createCameraTween(pos2, pos);
  }
  /**
   * 相机动画函数，从A点飞行到B点，A点表示相机当前所处状态
   * @param endPos {THREE.Vector3} 表示动画结束相机位置
   * @param endTarget {THREE.Vector3} 表示相机动画结束lookAt指向的目标观察点
   */
  private createCameraTween(endPos: THREE.Vector3, endTarget: THREE.Vector3) {
    const cameraStartPos = this.object!.position;
    const controlsPos = this.orbitControls.target;
    // console.log('createCameraTween', cameraStartPos, controlsPos, endPos, endTarget);
    const camera = this.object;
    const controls = this.orbitControls;
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
        camera.position.set(obj.x, obj.y, obj.z);
        // 动态计算相机视线
        // camera.lookAt(obj.tx, obj.ty, obj.tz);
        controls.target.set(obj.tx, obj.ty, obj.tz);
        controls.update(); //内部会执行.lookAt()
      })
      .start();
  }
}
export default PlayerControls;
