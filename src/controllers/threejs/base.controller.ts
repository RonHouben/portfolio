import { EventDispatcher, Object3D, Raycaster, Scene } from 'three'
import type { RaycasterController } from './raycaster.controller'

export interface BaseControllerOptions<T> {
	name: string
	scene: Scene
	position: Vector3
	rotation?: Vector3
	shadow?: ShadowOptions
	onClick?: ObjectInteractionFunction<T>
}

interface Vector3 {
	x?: number
	y?: number
	z?: number
}

export type AnimateFunction<T> = ObjectInteractionFunction<T>
export type ObjectInteractionFunction<T> = (obj: T) => void
export interface ShadowOptions {
	castShadow?: boolean
	receiveShadow?: boolean
}

interface UpdateOptions<T> extends Omit<BaseControllerOptions<T>, 'scene'> {
	raycasterIntersects: RaycasterController['intersects']
}

export abstract class BaseController<T extends Object3D> extends EventDispatcher  {
	public three!: T
	public name: BaseControllerOptions<T>['name']
	public scene: BaseControllerOptions<T>['scene']
	protected raycasterIntersects: RaycasterController['intersects'] = []
	private onClick: BaseControllerOptions<T>['onClick']

	constructor({
		name,
		scene,
		onClick
	}: Pick<BaseControllerOptions<T>, 'scene'> &
		Pick<BaseControllerOptions<T>, 'name'> &
		Pick<BaseControllerOptions<T>, 'onClick'>) {
		super()
		this.name = name
		this.scene = scene
		this.onClick = onClick
	}

	public abstract update(options: UpdateOptions<T>): void

	protected addEventListeners(): void {
		this.three.addEventListener('click', () => {
			if (this.onClick && this.isIntersected()) {
				this.onClick(this.three)
			}
		})
	}

	private isIntersected(): boolean {
		const intersected = this.raycasterIntersects.find(({ object }) => object.uuid === this.three.uuid)

		return intersected ? true : false
	}

	protected setPosition(options: BaseControllerOptions<T>['position']): void {
		this.three.position.x = options.x || this.three.position.x
		this.three.position.y = options.y || this.three.position.y
		this.three.position.z = options.z || this.three.position.z
	}

	protected setRotation(options: BaseControllerOptions<T>['rotation']): void {
		if (options) {
			this.three.rotation.x = options.x || this.three.rotation.x
			this.three.rotation.y = options.y || this.three.rotation.y
			this.three.rotation.z = options.z || this.three.rotation.z
		}
	}

	protected setShadow(options: BaseControllerOptions<T>['shadow']): void {
		if (options) {
			this.three.castShadow = options.castShadow || this.three.castShadow
			this.three.receiveShadow = options.receiveShadow || this.three.receiveShadow
		}
	}

	protected animate(func: AnimateFunction<T>): void {
		func(this.three as T)
	}
}
