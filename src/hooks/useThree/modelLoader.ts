import { type GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const dracoloader = new DRACOLoader();
dracoloader.setDecoderPath('/draco/');
dracoloader.preload();
/**
 * 加载gltf模型
 * @param url gltf resource URL
 */
export const loadGLTF = (
  url: string,
  onLoad: (data: GLTF) => void,
  onProgress?: (event: ProgressEvent<EventTarget>) => void,
  onError?: (err: unknown) => void
) => {
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoloader);
  loader.load(
    // resource URL
    url,
    // called when the resource is loaded
    onLoad,
    // called while loading is progressing
    onProgress,
    // called when loading has errors
    onError
  );
};
