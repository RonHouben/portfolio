import { PerspectiveCamera } from "three";
import type { BaseControllerOptions } from "../base.controller";
import { CameraController } from "./camera.controller";

interface PerspectiveCameraControllerOptions extends BaseControllerOptions {
	fov?: number
	aspect?: number
	near?: number
	far?: number
}

export class PerspectiveCameraController extends CameraController<PerspectiveCamera> {
	constructor({ name, scene, fov, aspect, near, far }: PerspectiveCameraControllerOptions) {
		super({ name, scene })

 		this.three = new PerspectiveCamera(fov, aspect, near, far)
		
		this.scene.add(this.three)
	}
}