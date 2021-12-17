import type { AnimateFunction } from '$lib/controllers/threejs/base.controller'
import type {
  CameraAnimateFunction,
  CameraControllerOptions,
  CameraInitOptions,
  CameraUpdateOptions
} from '$lib/controllers/threejs/cameras/camera.controller'
import { CameraController } from '$lib/controllers/threejs/cameras/camera.controller'
import { cameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store'
import { PerspectiveCamera } from 'three'
import { CameraHelperController } from '../helpers/camera.helper.controller'

export interface PerspectiveCameraControllerOptions extends CameraControllerOptions {
  fov?: number
  aspect?: number
  near?: number
  far?: number
}
export type PerspectiveCameraAnimateFunction = CameraAnimateFunction<PerspectiveCamera>
export type PerspectiveCameraInitOptions = CameraInitOptions
export type PerspectiveCameraUpdateOptions = CameraUpdateOptions
export class PerspectiveCameraController extends CameraController<PerspectiveCamera> {
  constructor(options: PerspectiveCameraControllerOptions) {
    const { fov, aspect, near, far } = options
    super(options)

    this.three = new PerspectiveCamera(fov, aspect, near, far)

    this.init(options)

    this.scene.add(this.three)

    cameraStore.set(this.three)
  }

  protected override init({
    name,
    position,
    rotation,
    shadow,
    showHelper
  }: PerspectiveCameraControllerOptions): void {
    this.three.name = name

    this.setPosition(position)
    this.setRotation(rotation)
    this.setShadow(shadow)
    this.enableHelper(showHelper)
  }

  public override update({ position, rotation, shadow }: PerspectiveCameraUpdateOptions): void {
    this.setPosition(position)
    this.setRotation(rotation)
    this.setShadow(shadow)

    this.three.updateProjectionMatrix()
  }

  public override animate(animateFunction: AnimateFunction<PerspectiveCamera>): void {
    requestAnimationFrame(() => this.animate(animateFunction))

    animateFunction(this.three, this.scene)
  }

  protected override enableHelper(
    showHelper: PerspectiveCameraControllerOptions['showHelper']
  ): void {
    if (showHelper) {
      new CameraHelperController(this.three)
    }
  }
}
