import { AxesHelper } from 'three'
import { BaseHelperController } from './base.helper.controller'

export interface AxesHelperControllerOptions {
	size: number
}

export class AxesHelperController extends BaseHelperController<AxesHelper> {
	constructor({ size }: AxesHelperControllerOptions) {
		super()

		this.three = new AxesHelper(size)

		this.scene.add(this.three)
	}
}
