import { LoadingManager } from 'three';

// function formatNumber(num: number) {
//   return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
// }
class Loader {
  dracoPath: string;
  ktx2Path: string;
  constructor(options: { dracoPath: string; ktx2Path: string } = { dracoPath: '/draco/', ktx2Path: '/basis/' }) {
    this.dracoPath = options?.dracoPath;
    this.ktx2Path = options.ktx2Path;
  }

  async loadFile(url: string, manager?: LoadingManager) {
    const extension = url!.split('.')?.pop()?.toLowerCase();
    // const reader = new FileReader();
    // reader.addEventListener('progress', function (event) {
    //   const size = '(' + formatNumber(Math.floor(event.total / 1000)) + ' KB)';
    //   const progress = Math.floor((event.loaded / event.total) * 100) + '%';

    //   console.log('Loading', file, size, progress);
    // });

    switch (extension) {
      case 'glb':
      case 'gltf': {
        const loader = await this.createGLTFLoader(manager);
        const result = await loader.loadAsync(url);
        const scene = result.scene;
        scene.name = url;
        scene.animations.push(...result.animations);

        loader?.dracoLoader?.dispose();
        loader?.ktx2Loader?.dispose();
        return scene;
      }

      default:
        throw new Error('not supported yet');
    }
  }

  private async createGLTFLoader(manager?: LoadingManager) {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');
    const { KTX2Loader } = await import('three/addons/loaders/KTX2Loader.js');
    const { MeshoptDecoder } = await import('three/addons/libs/meshopt_decoder.module.js');

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(this.dracoPath);

    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(this.ktx2Path);

    // editor.signals.rendererDetectKTX2Support.dispatch(ktx2Loader);

    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);

    return loader;
  }
}

export default Loader;
