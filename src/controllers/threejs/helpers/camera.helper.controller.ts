import type { Camera, Scene} from "three"
import { CameraHelper } from "three"

interface CameraHelperControllerOptions {
	camera: Camera
	scene: Scene
}

export class CameraHelperController {
	private scene: CameraHelperControllerOptions['scene']
	private camera: CameraHelperControllerOptions['camera']
	public three: CameraHelper

	constructor({ camera, scene }: CameraHelperControllerOptions) {
		this.camera = camera
		this.scene = scene

		this.three = new CameraHelper(this.camera)

		this.scene.add(this.three)
	}


}