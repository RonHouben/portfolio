import type {
  AnimateFunction,
  BaseControllerOptions,
  BaseInitOptions,
  BaseUpdateOptions
} from '$lib/controllers/threejs/base.controller'
import { BaseController } from '$lib/controllers/threejs/base.controller'
import type { Camera } from 'three'

export type CameraControllerOptions = Omit<BaseControllerOptions, 'raycaster'>
export type CameraAnimateFunction<T extends Camera> = AnimateFunction<T>
export type CameraInitOptions = BaseInitOptions
export type CameraUpdateOptions = Omit<BaseUpdateOptions, 'raycasterIntersects'>

export abstract class CameraController<T extends Camera> extends BaseController<T> {}
