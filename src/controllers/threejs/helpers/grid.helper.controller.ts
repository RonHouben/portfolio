import { GridHelper, Scene } from 'three'

export interface GridHelperControllerOptions {
	scene: Scene
	size: number
	divisions: number
}

export class GridHelperController {
	private three: GridHelper
	private scene: GridHelperControllerOptions['scene']

	constructor({ scene, size, divisions }: GridHelperControllerOptions) {
		this.three = new GridHelper(size, divisions)
		this.scene = scene

		this.scene.add(this.three)
	}
}
