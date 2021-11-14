import { AxesHelper } from "three";
import { BaseHelperController, BaseHelperControllerOptions } from "./base.helper.controller";

export interface AxesHelperControllerOptions extends BaseHelperControllerOptions {
	size: number
}

export class AxesHelperController extends BaseHelperController<AxesHelper> {
	constructor({ scene, size }: AxesHelperControllerOptions) {
		super({ scene })

		this.three = new AxesHelper(size)

		this.scene.add(this.three)
	}
}