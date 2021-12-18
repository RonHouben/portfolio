<script lang="ts" context="module">
  import type {
    AnimateFunction,
    BaseControllerOptions,
    BaseInitOptions,
    BaseUpdateOptions
  } from '$lib/controllers/threejs/base.controller.svelte'
  import { BaseController } from '$lib/controllers/threejs/base.controller.svelte'
  import type { Camera } from 'three'

  export interface CameraControllerOptions extends Omit<BaseControllerOptions<Camera>, 'raycaster'> {
    helpers?: {
      enable: boolean
    }
  }
  export type CameraAnimateFunction<T extends Camera> = AnimateFunction<T>
  export type CameraInitOptions = BaseInitOptions<Camera> & CameraControllerOptions['helpers']
  export type CameraUpdateOptions = Omit<BaseUpdateOptions<Camera>, 'raycasterIntersects'>

  export abstract class CameraController<T extends Camera> extends BaseController<T> {
    protected abstract enableHelpers(helpers: CameraControllerOptions['helpers']): void
  }
</script>
