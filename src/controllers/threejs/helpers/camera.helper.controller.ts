import type { Camera, Scene } from 'three'
import { CameraHelper } from 'three'
import { BaseHelperController } from './base.helper.controller'

interface CameraHelperControllerOptions {
	camera: Camera
	scene: Scene
}

export class CameraHelperController extends BaseHelperController<CameraHelper> {
	constructor({ camera, scene }: CameraHelperControllerOptions) {
		super({ scene })

		this.three = new CameraHelper(camera)

		this.scene.add(this.three)
	}
}
