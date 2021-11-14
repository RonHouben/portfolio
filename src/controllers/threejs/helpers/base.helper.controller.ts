import type { Scene } from "three"

export interface BaseHelperControllerOptions {
	scene: Scene 
}

export abstract class BaseHelperController<T> {
	public three!: T
	protected scene: BaseHelperControllerOptions['scene']

	constructor({ scene }: BaseHelperControllerOptions) {
		this.scene = scene
	}
}