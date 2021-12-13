import type {
  AnimateFunction,
  BaseControllerOptions,
  BaseInitOptions,
  BaseUpdateOptions,
  ShadowOptions
} from '$lib/controllers/threejs/base.controller'
import { BaseController } from '$lib/controllers/threejs/base.controller'
import type { ColorRepresentation, Light } from 'three'
import { Color } from 'three'

export interface LightControllerOptions extends Omit<BaseControllerOptions, 'onClick'> {
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

export interface LightInitOptions extends BaseInitOptions {
  color?: LightControllerOptions['color']
  intensity?: LightControllerOptions['intensity']
}

export interface LightUpdateOptions extends Omit<BaseUpdateOptions, 'raycasterIntersects'> {
  color?: LightControllerOptions['color']
  intensity?: LightControllerOptions['intensity']
}
export abstract class LightController<T extends Light> extends BaseController<T> {
  protected setColor(color: LightControllerOptions['color']): void {
    this.three.color = new Color(color) || this.three.color
  }

  protected setIntensity(intensity: LightControllerOptions['intensity']): void {
    this.three.intensity = intensity || this.three.intensity
  }
}
