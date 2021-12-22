<script lang="ts" context="module">
  import type {
    AnimateFunction,
    BaseControllerOptions,
    BaseInitOptions,
    BaseUpdateOptions,
    ShadowOptions
  } from '$lib/controllers/threejs/base.controller.svelte'
  import { BaseController } from '$lib/controllers/threejs/base.controller.svelte'
  import type { ColorRepresentation, Light } from 'three'
  import { Color } from 'three'

  export interface LightControllerOptions<T extends Light>
    extends Omit<BaseControllerOptions<T>, 'onClick'> {
    color?: ColorRepresentation
    intensity?: number
  }
  export type LightAnimateFunction<T extends Light> = AnimateFunction<T>
  export interface LightHelperOptions {
    enabled: boolean
    color?: ColorRepresentation
    size?: number
  }

  export interface LightShadowOptions extends ShadowOptions {
    mapSize?: {
      width?: number
      height?: number
    }
  }

  export interface LightInitOptions<T extends Light> extends BaseInitOptions<T> {
    color?: LightControllerOptions<T>['color']
    intensity?: LightControllerOptions<T>['intensity']
  }

  export interface LightUpdateOptions<T extends Light>
    extends Omit<BaseUpdateOptions<T>, 'raycasterIntersects'> {
    color?: LightControllerOptions<T>['color']
    intensity?: LightControllerOptions<T>['intensity']
  }
  export abstract class LightController<T extends Light> extends BaseController<T> {
    protected setColor(color: LightControllerOptions<T>['color']): void {
      this.three.color = new Color(color) || this.three.color
    }

    protected setIntensity(intensity: LightControllerOptions<T>['intensity']): void {
      this.three.intensity = intensity || this.three.intensity
    }
  }
</script>
