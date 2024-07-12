import * as THREE from 'three';
import { Player } from './player';

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
class Selector {
  scene: THREE.Scene;
  selected: THREE.Object3D<THREE.Object3DEventMap> | null;
  player: Player;
  constructor(player: Player) {
    this.scene = player.scene;
    this.selected = null;
    this.player = player;
    // signals
    player.events.intersectionsDetected.add((intersects) => {
      if (intersects.length > 0) {
        const object = intersects[0].object;
        this.select(object);
        // if (object.userData.object !== undefined) {
        //   // helper

        //   this.select(object.userData.object);
        // } else {
        //   this.select(object);
        // }
      } else {
        this.select(null);
      }
    });
  }

  getIntersects(raycaster: THREE.Raycaster) {
    const objects: THREE.Object3D[] = [];

    this.scene.traverseVisible(function (child) {
      objects.push(child);
    });

    return raycaster.intersectObjects(objects, false);
  }

  getPointerIntersects(point: THREE.Vector2, camera: THREE.Camera) {
    mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);

    raycaster.setFromCamera(mouse, camera);

    return this.getIntersects(raycaster);
  }

  select(object: THREE.Object3D | null) {
    if (this.selected === object) return;

    // const uuid = null;

    // if (object !== null) {
    //   uuid = object.uuid;
    // }

    this.selected = object;
    // this.editor.config.setKey('selected', uuid);
    this.player.events.objectSelected.dispatch(object);
    // this.signals.objectSelected.dispatch(object);
  }

  deselect() {
    this.select(null);
  }
}

export default Selector;
