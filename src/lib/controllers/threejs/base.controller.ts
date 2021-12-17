import type {
  PerspectiveCameraInitOptions,
  PerspectiveCameraUpdateOptions
} from '$lib/controllers/threejs/cameras/perspective.camera'
import type { DirectionalLightUpdateOptions } from '$lib/controllers/threejs/lights/directional.light.controller'
import type {
  GroupInitOptions,
  GroupUpdateOptions
} from '$lib/controllers/threejs/objects/group.controller'
import type { MeshUpdateOptions } from '$lib/controllers/threejs/objects/mesh.controller'
import type {
  PointsInitOptions,
  PointsUpdateOptions
} from '$lib/controllers/threejs/objects/points.controller'
import { raycasterStore } from '$lib/stores/threejs/raycaster.store'
import { sceneStore } from '$lib/stores/threejs/scene.store'
import { get } from 'svelte/store'
import type { Object3D } from 'three'
import { EventDispatcher, Scene } from 'three'
import type { CameraInitOptions } from './cameras/camera.controller'

export interface BaseControllerOptions {
  name: string
  position?: Vector3
  rotation?: Vector3
  shadow?: ShadowOptions
}

interface Vector3 {
  x?: number
  y?: number
  z?: number
}

export type AnimateFunction<T> = (obj: T, scene: Scene) => void
export type ObjectInteractionFunction<E> = (event: E) => void
export interface ShadowOptions {
  castShadow?: boolean
  receiveShadow?: boolean
}
export type BaseInitOptions = BaseControllerOptions
export type BaseUpdateOptions = BaseControllerOptions

type InteractionState = 'idle' | 'entering' | 'interacting'

export abstract class BaseController<T extends Object3D> extends EventDispatcher {
  public three!: T
  public name: BaseControllerOptions['name']
  protected scene: Scene
  protected interactionState: InteractionState

  constructor({ name }: Pick<BaseControllerOptions, 'name'>) {
    super()
    this.name = name
    this.scene = get(sceneStore)
    this.interactionState = 'idle'
  }

  protected abstract init(
    options:
      | BaseInitOptions
      | PointsInitOptions
      | GroupInitOptions
      | CameraInitOptions
      | PerspectiveCameraInitOptions
  ): void

  public abstract update(
    options:
      | BaseUpdateOptions
      | MeshUpdateOptions
      | DirectionalLightUpdateOptions
      | PerspectiveCameraUpdateOptions
      | PointsUpdateOptions
      | GroupUpdateOptions
  ): void

  public abstract animate(animateFunction: AnimateFunction<T>): void

  protected isIntersected(): boolean {
    const { intersects } = get(raycasterStore)

    const intersected = intersects.find(({ object }) => object.uuid === this.three.uuid)

    return !!intersected
  }

  protected setPosition(options?: BaseControllerOptions['position']): void {
    this.three.position.x = options?.x || this.three.position.x
    this.three.position.y = options?.y || this.three.position.y
    this.three.position.z = options?.z || this.three.position.z
  }

  protected setRotation(options: BaseControllerOptions['rotation']): void {
    if (options) {
      this.three.rotation.z = options.x || this.three.rotation.x
      this.three.rotation.y = options.y || this.three.rotation.y
      this.three.rotation.z = options.z || this.three.rotation.z
    }
  }

  protected setShadow(options: BaseControllerOptions['shadow']): void {
    if (options) {
      this.three.castShadow = options.castShadow || this.three.castShadow
      this.three.receiveShadow = options.receiveShadow || this.three.receiveShadow
    }
  }
}
