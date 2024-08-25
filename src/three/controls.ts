import { OrbitControls } from 'three/examples/jsm/Addons.js';
import TWEEN, { Easing } from '@tweenjs/tween.js';
import * as THREE from 'three';

const focusEvent = { type: 'focus' };
const changeEvent = { type: 'change' };

type ControlOptions = {
  autoRotate: boolean;
  autoRotateSpeed: number;
  minDistance: number;
  maxDistance: number;
  dampingFactor: number;
  enableDamping: boolean;
  enabled: boolean;
};
class PlayerControls extends THREE.EventDispatcher<any> {
  private object: THREE.Camera;
  private domElement: HTMLElement;
  private orbitControls: OrbitControls;
  enabled: boolean = true;
  constructor(object: THREE.Camera, domElement: HTMLElement, options?: ControlOptions) {
    super();
    this.object = object;
    this.domElement = domElement;
    this.orbitControls = new OrbitControls(this.object, this.domElement);
    this.orbitControls.minDistance = options?.minDistance || 5;
    this.orbitControls.maxDistance = options?.maxDistance || 100;
    this.orbitControls.enableDamping = options?.enableDamping || false; //启用阻尼
    this.orbitControls.enabled = options?.enabled ?? true;
    this.orbitControls.maxPolarAngle = THREE.MathUtils.degToRad(90);
    this.addDomEvents();

    this.orbitControls.addEventListener('change', () => {
      // 浏览器控制台查看相机位置变化
      this.dispatchEvent(changeEvent);
    });
  }
  private addDomEvents() {
    this.domElement.addEventListener('click', this.onClick);
    this.domElement.addEventListener('pointermove', this.onPointerMove);
    this.domElement.addEventListener('dblclick', this.onDoubleClick.bind(this));
  }

  private onClick(_event: MouseEvent) {}
  private onDoubleClick() {
    this.orbitControls.reset();
  }
  private onPointerMove() {}

  public reset() {
    this.orbitControls.reset();
  }
  public saveState() {
    this.orbitControls.saveState();
  }
  public update(deltaTime?: number): boolean {
    return this.orbitControls.update(deltaTime);
  }
  /**
   * Returns the distance from the camera to the target.
   * @returns number
   */
  public getDistance() {
    return this.orbitControls.getDistance();
  }
  get maxDistance() {
    return this.orbitControls.maxDistance;
  }
  set maxDistance(value: number) {
    this.orbitControls.maxDistance = value;
  }
  /**
   * 将相机聚焦到指定的物体，并拉近相机距离
   * @param target Object3D - 聚焦的目标
   * @param options.scalar - number  default 5 , 相机位置的矩阵乘该标量值用于与聚焦对象拉开一定距离
   */
  public focus(
    target: THREE.Object3D,
    options?: {
      scalar?: number;
    }
  ) {
    const _DEFAULT_OPTIONS = {
      scalar: 5,
    };
    const camera = this.object;
    const controls = this.orbitControls;

    /** 相机位置与focus目标拉的偏移量 */
    const scalar = options?.scalar !== undefined ? options.scalar : _DEFAULT_OPTIONS.scalar;
    const box = new THREE.Box3();
    const center = new THREE.Vector3();
    const sphere = new THREE.Sphere();
    // 相机移动的偏移量
    const delta = new THREE.Vector3();
    let distance = 0;
    // 获取目标对象的包围盒
    box.setFromObject(target);
    box.getCenter(center);
    distance = box.getBoundingSphere(sphere).radius;

    // const quaternion = new THREE.Quaternion();
    // target.getWorldQuaternion(quaternion);
    // // quaternion.copy(camera.quaternion);
    // //相机以45度角俯视
    // quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 4));
    delta.set(0, 0, 1);
    // delta.applyQuaternion(quaternion);
    delta.multiplyScalar(distance * scalar);

    const cameraPositionStart = camera.position.clone();
    const cameraPositionEnd = center.clone().add(delta);
    // 相机初始观察点
    const targetStartPoint: THREE.Vector3 = controls.target.clone();
    const targetEndPoint = center.clone();
    const eventdispatcher = this.dispatchEvent.bind(this);
    new TWEEN.Tween({
      // 不管相机此刻处于什么状态，直接读取当前的位置和目标观察点
      x: cameraPositionStart.x,
      y: cameraPositionStart.y,
      z: cameraPositionStart.z,
      tx: targetStartPoint.x,
      ty: targetStartPoint.y,
      tz: targetStartPoint.z,
    })
      .to(
        {
          // 动画结束相机位置坐标
          x: cameraPositionEnd.x,
          y: cameraPositionEnd.y,
          z: cameraPositionEnd.z,
          tx: targetEndPoint.x,
          ty: targetEndPoint.y,
          tz: targetEndPoint.z,
        },
        1000
      )
      .easing(Easing.Quadratic.Out)
      .onUpdate(function (obj) {
        // 动态改变相机位置
        camera.position.set(obj.x, obj.y, obj.z);
        // 设置相机的视线
        controls.target.set(obj.tx, obj.ty, obj.tz);
        controls.update();
      })
      .onComplete(() => {
        eventdispatcher(focusEvent);
      })
      .start();
  }
}
export default PlayerControls;
