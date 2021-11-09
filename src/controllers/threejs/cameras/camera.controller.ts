import type { Camera } from "three"
import type { AnimateFunction, BaseControllerOptions  } from '../base.controller'
import { BaseController } from "../base.controller"

export type CameraControllerOptions = BaseControllerOptions
export type CameraAnimateFunction <T extends Camera> = AnimateFunction<T>

export class CameraController<T extends Camera> extends BaseController<T> {}