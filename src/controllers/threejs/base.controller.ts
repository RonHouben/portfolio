import type { Object3D, Scene, Vector3 } from 'three'

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

export interface AnimateOptions {
	rotateY?: number
	rotateX?: number
	rotateZ?: number
	translateX?: Translate
	translateY?: Translate
	translateZ?: Translate
	lookAt?: Vector3
}

export interface ShadowOptions {
	castShadow?: boolean
	receiveShadow?: boolean
}

interface Translate {
	distance: number
	limit?: number
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

	public animate(options: AnimateOptions, fn?: () => void): void {
		requestAnimationFrame(() => this.animate(options, fn))

		this.three.rotateX(options.rotateX || 0)
		this.three.rotateY(options.rotateY || 0)
		this.three.rotateZ(options.rotateZ || 0)

		const positiveDistanceX: boolean = options.translateX ? options.translateX?.distance >= 0 : true
		const positiveDistanceY: boolean = options.translateY ? options.translateY?.distance >= 0 : true
		const positiveDistanceZ: boolean = options.translateZ ? options.translateZ?.distance >= 0 : true

		const reachedTranslateXLimit =
			options.translateX && options.translateX.limit
				? positiveDistanceX
					? this.three.position.x >= options.translateX.limit
					: this.three.position.x <= options.translateX.limit
				: false

		const reachedTranslateYLimit =
			options.translateY && options.translateY.limit
				? positiveDistanceY
					? this.three.position.y >= options.translateY.limit
					: this.three.position.y <= options.translateY.limit
				: false

		const reachedTranslateZLimit =
			options.translateZ && options.translateZ.limit
				? positiveDistanceZ
					? this.three.position.z >= options.translateZ.limit
					: this.three.position.z <= options.translateZ.limit
				: false

		if (!reachedTranslateXLimit && options.translateX) {
			this.three.translateX(options.translateX?.distance || 0)
		}

		if (!reachedTranslateYLimit && options.translateY) {
			this.three.translateY(options.translateY?.distance || 0)
		}

		if (!reachedTranslateZLimit && options.translateZ) {
			this.three.translateZ(options.translateZ?.distance || 0)
		}

		if (options.lookAt) {
			this.three.lookAt(options.lookAt)
		}

		if (fn) {
			fn()
		}
	}
}
