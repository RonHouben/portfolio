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
    const { name, fov, aspect, near, far } = options
    super({ name })

    this.three = new PerspectiveCamera(fov, aspect, near, far)

    this.init(options)

    this.scene.add(this.three)

    cameraStore.set(this.three)
  }

  protected override init({
    name,
    position,
    rotation,
    shadow
  }: PerspectiveCameraInitOptions): void {
    this.three.name = name

    this.setPosition(position)
    this.setRotation(rotation)
    this.setShadow(shadow)
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
}
