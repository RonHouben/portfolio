<script lang="ts" context="module">
  import { Interactable, InteractionOptions } from '$lib/controllers/interactable.controller.svelte'
  import type { CameraInitOptions } from '$lib/controllers/threejs/cameras/camera.controller.svelte'
  import type { PerspectiveCameraInitOptions } from '$lib/controllers/threejs/cameras/perspective.camera.svelte'
  import type { GroupInitOptions } from '$lib/controllers/threejs/objects/group.controller.svelte'
  import type { PointsInitOptions } from '$lib/controllers/threejs/objects/points.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte';
  import { get } from 'svelte/store'
  import type { Object3D } from 'three'
  import type { Scene, Event } from 'three'
  import type { PhysicsBody } from '../cannon-es/body.controller.svelte'

  export interface BaseControllerOptions<T extends ThreeJSObject> {
    name: string
    position?: Vector3
    rotation?: Vector3
    shadow?: ShadowOptions
    interactions?: InteractionOptions<T>
  }

  export interface ThreeJSObject extends Object3D<Event> {}


  export type AnimateFunction<T> = (obj: T, scene: Scene) => void
  export interface ShadowOptions {
    castShadow?: boolean
    receiveShadow?: boolean
  }
  export type BaseInitOptions<T extends ThreeJSObject> = BaseControllerOptions<T>
  export type BaseUpdateOptions<T extends ThreeJSObject> = BaseControllerOptions<T>

  export abstract class BaseController<T extends ThreeJSObject> extends Interactable<T> {
    public abstract three: T
    protected scene: Scene
    protected physicsBody?: PhysicsBody

    constructor({ interactions }: BaseControllerOptions<T>) {
      super(interactions)
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

    public abstract animate(animateFunction: AnimateFunction<T>): void

    protected setPosition(options?: BaseControllerOptions<T>['position']): void {
      this.three.position.x = options?.x || this.three.position.x
      this.three.position.y = options?.y || this.three.position.y
      this.three.position.z = options?.z || this.three.position.z
    }

    protected setRotation(options: BaseControllerOptions<T>['rotation']): void {
      if (options) {
        this.three.rotateX(options.x || 0)
        this.three.rotateY(options.y || 0)
        this.three.rotateZ(options.z || 0)
      }
    }

    protected setShadow(options: BaseControllerOptions<T>['shadow']): void {
      if (options) {
        this.three.castShadow = options.castShadow || this.three.castShadow
        this.three.receiveShadow = options.receiveShadow || this.three.receiveShadow
      }
    }

    public setPhysicsBody(physicsBody: PhysicsBody): void {
      this.physicsBody = physicsBody
    }

    abstract updateOptions(options: BaseControllerOptions<T>): void 
  }
</script>
