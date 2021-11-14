import type { Object3D, Scene } from 'three'

export interface BaseControllerOptions {
	name: string
	scene: Scene
	position: Vector3
	rotation?: Vector3
	shadow?: ShadowOptions
}

interface Vector3 {
	x?: number
	y?: number
	z?: number
}

export type AnimateFunction<T> = (obj: T) => void
export type OnMousemoveFunction<T> = (obj: T) => void
export interface ShadowOptions {
	castShadow?: boolean
	receiveShadow?: boolean
}

export abstract class BaseController<T extends Object3D> {
	public three!: T
	public name: string
	public scene: Scene

	constructor(options: Pick<BaseControllerOptions, 'scene'> & Pick<BaseControllerOptions, 'name'>) {
		this.name = options.name
		this.scene = options.scene
	}

	public abstract update(options: Omit<BaseControllerOptions, 'scene'>): void

	protected setPosition(options: BaseControllerOptions['position']): void {
		this.three.position.x = options.x || this.three.position.x
		this.three.position.y = options.y || this.three.position.y
		this.three.position.z = options.z || this.three.position.z
	}

	protected setRotation(options: BaseControllerOptions['rotation']): void {
		if (options) {
			this.three.rotation.x = options.x || this.three.rotation.x
			this.three.rotation.y = options.y || this.three.rotation.y
			this.three.rotation.z = options.z || this.three.rotation.z
		}
	}

	protected setShadow(options: BaseControllerOptions['shadow']): void {
		if (options) {
			this.three.castShadow = options.castShadow || this.three.castShadow
			this.three.receiveShadow = options.receiveShadow || this.three.receiveShadow
		}
	}

	protected animate(func: AnimateFunction<T>): void {
		func(this.three as T)
	}
}
