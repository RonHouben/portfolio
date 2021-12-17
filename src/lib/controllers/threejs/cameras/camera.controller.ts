import type {
  AnimateFunction,
  BaseControllerOptions,
  BaseInitOptions,
  BaseUpdateOptions
} from '$lib/controllers/threejs/base.controller'
import { BaseController } from '$lib/controllers/threejs/base.controller'
import type { Camera } from 'three'

export interface CameraControllerOptions extends Omit<BaseControllerOptions, 'raycaster'> {
  showHelper?: boolean
}
export type CameraAnimateFunction<T extends Camera> = AnimateFunction<T>
export type CameraInitOptions = BaseInitOptions & CameraControllerOptions['showHelper']
export type CameraUpdateOptions = Omit<BaseUpdateOptions, 'raycasterIntersects'>

export abstract class CameraController<T extends Camera> extends BaseController<T> {
  protected abstract enableHelper(showHelper: CameraControllerOptions['showHelper']): void
}
