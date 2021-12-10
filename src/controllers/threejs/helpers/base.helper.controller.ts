import { sceneStore } from '../../../stores/threejs/scene.store'
import { get } from 'svelte/store'
import type { Scene } from 'three'

export abstract class BaseHelperController<T> {
  public three!: T
  protected scene: Scene

  constructor() {
    this.scene = get(sceneStore)
  }
}
