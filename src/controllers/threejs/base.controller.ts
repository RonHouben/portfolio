import type { Object3D, Scene } from 'three'

export interface BaseControllerOptions {
	name: string
	scene: Scene
}

export type PositionOptions = Vector
export type RotateOptions = Vector

interface Vector {
	x?: number
	y?: number
	z?: number
}

export type AnimateFunction<T> = (obj: T) => void
export interface ShadowOptions {
	castShadow?: boolean
	receiveShadow?: boolean
}

export abstract class BaseController<T extends Object3D> {
	public three!: T
	public name: string
	public scene: Scene

	constructor(options: BaseControllerOptions) {
		this.name = options.name
		this.scene = options.scene
	}

	public position(options: PositionOptions): void {
		this.three.position.x = options.x || this.three.position.x
		this.three.position.y = options.y || this.three.position.y
		this.three.position.z = options.z || this.three.position.z
	}

	public rotate(options: RotateOptions): void {
		this.three.rotation.x = options.x || this.three.rotation.x
		this.three.rotation.y = options.y || this.three.rotation.y
		this.three.rotation.z = options.z || this.three.rotation.z
	}

	public shadow(options: ShadowOptions): void {
		this.three.castShadow = options.castShadow || this.three.castShadow
		this.three.receiveShadow = options.receiveShadow || this.three.receiveShadow
	}

	public animate(func: AnimateFunction<T>): void {
		func(this.three)
	}
}
