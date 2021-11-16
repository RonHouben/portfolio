import type { Camera } from 'three'
import type { AnimateFunction, BaseControllerOptions } from '../base.controller'
import { BaseController } from '../base.controller'

export type CameraControllerOptions = Omit<BaseControllerOptions, 'raycaster'>
export type CameraAnimateFunction<T extends Camera> = AnimateFunction<T>

export abstract class CameraController<T extends Camera> extends BaseController<T> {}
