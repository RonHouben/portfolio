import { PerspectiveCamera } from 'three'
import { cameraStore } from '../../../stores/threejs/cameras/perspective.camera.store'
import type { CameraAnimateFunction, CameraControllerOptions, CameraInitOptions, CameraUpdateOptions } from './camera.controller'
import { CameraController } from './camera.controller'

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

	protected override init({  name, position, rotation, shadow }: PerspectiveCameraInitOptions): void {
		this.three.name = name

		this.setPosition(position)
		this.setRotation(rotation)
		this.setShadow(shadow)
	}

	public override update({ position, rotation, shadow }: PerspectiveCameraUpdateOptions): void {
		this.setPosition(position)
		this.setRotation(rotation)
		this.setShadow(shadow)
	}
}
