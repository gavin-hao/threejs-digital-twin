import { Mesh, Object3D } from 'three';

class Object3DWrap extends Mesh {
  public ancestors?: Object3D = undefined;
  constructor() {
    super();
  }
}

export { Object3DWrap };
