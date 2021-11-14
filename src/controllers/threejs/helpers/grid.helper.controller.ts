import { GridHelper } from 'three'
import { BaseHelperController, BaseHelperControllerOptions } from './base.helper.controller'

export interface GridHelperControllerOptions extends BaseHelperControllerOptions {
	size: number
	divisions: number
}

export class GridHelperController extends BaseHelperController<GridHelper> {
	constructor({ scene, size, divisions }: GridHelperControllerOptions) {
		super({ scene })

		this.three = new GridHelper(size, divisions)

		this.scene.add(this.three)
	}
}
