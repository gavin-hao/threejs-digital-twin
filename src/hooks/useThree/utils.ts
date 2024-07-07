import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { isFunction } from 'lodash';
export function findParent(
  object3d: THREE.Object3D,
  predicate: (obj: THREE.Object3D) => boolean
): THREE.Object3D | null {
  let parent: THREE.Object3D | null = object3d;
  while (!predicate(parent)) {
    parent = parent.parent;
    if (parent === null) {
      return null;
    }
  }
  return parent;
}

export const animation = (props: {
  from: Record<string, any>;
  to: Record<string, any>;
  duration: number;
  easing?: any;
  onUpdate: (params: Record<string, any>) => void;
  onComplete?: (params: Record<string, any>) => void;
}) => {
  const { from, to, duration, easing = TWEEN.Easing.Quadratic.Out, onUpdate, onComplete } = props;
  return new TWEEN.Tween(from)
    .to(to, duration)
    .easing(easing)
    .onUpdate((object) => isFunction(onUpdate) && onUpdate(object))
    .onComplete((object) => isFunction(onComplete) && onComplete(object))
    .start();
};
