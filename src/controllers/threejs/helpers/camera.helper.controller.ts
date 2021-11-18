import { Camera, CameraHelper } from 'three'
import { BaseHelperController } from './base.helper.controller'

export interface CameraHelperControllerOptions {
	cameraName: string
}

export class CameraHelperController extends BaseHelperController<CameraHelper> {
	constructor({ cameraName }: CameraHelperControllerOptions) {
		super()

		const camera = this.scene.getObjectByName(cameraName) as Camera

		if (!camera) {
			throw new Error(`Couldn't find camera with name: "${cameraName}"`)
		} else {
			this.three = new CameraHelper(camera)

			this.scene.add(this.three)
		}
	}
}
