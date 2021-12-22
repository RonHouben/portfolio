<script lang="ts" context="module">
  import type { InteractionOptions } from '$lib/controllers/interactable.controller.svelte'
  import type {
    AnimateFunction,
    BaseControllerOptions,
    BaseInitOptions,
    BaseUpdateOptions
  } from '$lib/controllers/threejs/base.controller.svelte'
  import { BaseController } from '$lib/controllers/threejs/base.controller.svelte'
  import { rendererStore } from '$lib/stores/threejs/renderer.store.svelte'
  import { get } from 'svelte/store'
  import type { Scene } from 'three'
  import type { Camera, PerspectiveCamera } from 'three'

  export interface CameraControllerOptions
    extends Omit<BaseControllerOptions<Camera>, 'raycaster'> {
    helpers?: {
      enable: boolean
    }
    interactions?: InteractionOptions<Camera>
  }
  export type CameraAnimateFunction<T extends Camera> = AnimateFunction<T>
  export type CameraInitOptions = BaseInitOptions<Camera> & CameraControllerOptions['helpers']
  export type CameraUpdateOptions = Omit<BaseUpdateOptions<Camera>, 'raycasterIntersects'>

  export abstract class CameraController<T extends Camera> extends BaseController<T> {
    constructor(scene: Scene, options: CameraControllerOptions) {
      super(options)

      this.scene = scene

      addEventListener('resize', () => this.onWindowResize(), false)
    }
    protected abstract enableHelpers(helpers: CameraControllerOptions['helpers']): void

    protected setCamera(): void {
      if (this.three.type === 'PerspectiveCamera') {
        this.setPerspectiveCameraAspectRatio(this.three as unknown as PerspectiveCamera)
      }
    }

    private setPerspectiveCameraAspectRatio(camera: PerspectiveCamera): void {
      const renderer = get(rendererStore)
      camera.aspect = (renderer.domElement.width || 0) / (renderer.domElement.height || 0)
      camera.updateProjectionMatrix()
    }

    private onWindowResize(): void {
      this.setCamera()
    }
  }
</script>
