import { PerspectiveCamera } from 'three'
import { cameraStore } from '../../../stores/threejs/cameras/perspective.camera.store'
import type { CameraAnimateFunction, CameraControllerOptions } from './camera.controller'
import { CameraController } from './camera.controller'

export interface PerspectiveCameraControllerOptions extends CameraControllerOptions {
	fov?: number
	aspect?: number
	near?: number
	far?: number
}

export type PerspectiveCameraAnimateFunction = CameraAnimateFunction<PerspectiveCamera>
export class PerspectiveCameraController extends CameraController<PerspectiveCamera> {
	constructor(options: PerspectiveCameraControllerOptions) {
		const { name, scene, fov, aspect, near, far } = options
		super({ name, scene })

		this.three = new PerspectiveCamera(fov, aspect, near, far)

		this.update(options)

		this.scene.add(this.three)

		cameraStore.set(this.three)
	}

	public override update({ position, rotation, shadow }: PerspectiveCameraControllerOptions): void {
		this.setPosition(position)
		this.setRotation(rotation)
		this.setShadow(shadow)
	}
}
