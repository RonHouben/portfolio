<script lang="ts" context="module">
  import type {
    PerspectiveCameraInitOptions,
    PerspectiveCameraUpdateOptions
  } from '$lib/controllers/threejs/cameras/perspective.camera.svelte'
  import type { DirectionalLightUpdateOptions } from '$lib/controllers/threejs/lights/directional.light.controller.svelte'
  import type {
    GroupInitOptions,
    GroupUpdateOptions
  } from '$lib/controllers/threejs/objects/group.controller.svelte'
  import type { MeshUpdateOptions } from '$lib/controllers/threejs/objects/mesh.controller.svelte'
  import type {
    PointsInitOptions,
    PointsUpdateOptions
  } from '$lib/controllers/threejs/objects/points.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { get } from 'svelte/store'
  import type { Object3D, Scene } from 'three'
  import { Interactable, InteractionOptions } from '../interactable.controller.svelte'
  import type { CameraInitOptions } from './cameras/camera.controller.svelte'

  export interface BaseControllerOptions<T> {
    name: string
    position?: Vector3
    rotation?: Vector3
    shadow?: ShadowOptions
    interactions?: InteractionOptions<T>
  }

  interface Vector3 {
    x?: number
    y?: number
    z?: number
  }

  export type AnimateFunction<T> = (obj: T, scene: Scene) => void
  export interface ShadowOptions {
    castShadow?: boolean
    receiveShadow?: boolean
  }
  export type BaseInitOptions<T> = BaseControllerOptions<T>
  export type BaseUpdateOptions<T> = BaseControllerOptions<T>

  export abstract class BaseController<T extends Object3D> extends Interactable<T> {
    public name: BaseControllerOptions<T>['name']

    constructor({ name, interactions }: BaseControllerOptions<T>) {
      super(interactions)
      this.name = name
      this.scene = get(sceneStore)
    }

    protected abstract init(
      options:
        | BaseInitOptions<T>
        | PointsInitOptions
        | GroupInitOptions
        | CameraInitOptions
        | PerspectiveCameraInitOptions
    ): void

    public abstract update(
      options:
        | BaseUpdateOptions<T>
        | MeshUpdateOptions
        | DirectionalLightUpdateOptions
        | PerspectiveCameraUpdateOptions
        | PointsUpdateOptions
        | GroupUpdateOptions
    ): void

    public abstract animate(animateFunction: AnimateFunction<T>): void


    protected setPosition(options?: BaseControllerOptions<T>['position']): void {
      this.three.position.x = options?.x || this.three.position.x
      this.three.position.y = options?.y || this.three.position.y
      this.three.position.z = options?.z || this.three.position.z
    }

    protected setRotation(options: BaseControllerOptions<T>['rotation']): void {
      if (options) {
        this.three.rotation.z = options.x || this.three.rotation.x
        this.three.rotation.y = options.y || this.three.rotation.y
        this.three.rotation.z = options.z || this.three.rotation.z
      }
    }

    protected setShadow(options: BaseControllerOptions<T>['shadow']): void {
      if (options) {
        this.three.castShadow = options.castShadow || this.three.castShadow
        this.three.receiveShadow = options.receiveShadow || this.three.receiveShadow
      }
    }
  }
</script>
