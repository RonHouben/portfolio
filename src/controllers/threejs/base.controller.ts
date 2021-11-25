import { get } from 'svelte/store'
import type { Object3D } from 'three'
import { EventDispatcher, Scene } from 'three'
import { raycasterIntersectsStore } from '../../stores/threejs/raycaster.store'
import { sceneStore } from '../../stores/threejs/scene.store'
import type { PerspectiveCameraUpdateOptions } from './cameras/perspective.camera'
import type { DirectionalLightUpdateOptions } from './lights/directional.light.controller'
import type { MeshUpdateOptions } from './objects/mesh.controller'
import type { PointsInitOptions, PointsUpdateOptions } from './objects/points.controller'

export interface BaseControllerOptions {
	name: string
	position: Vector3
	rotation?: Vector3
	shadow?: ShadowOptions
}

interface Vector3 {
	x?: number
	y?: number
	z?: number
}

export type AnimateFunction<T> = ObjectInteractionFunction<T>
export type ObjectInteractionFunction<T> = (obj: T, scene: Scene) => void
export interface ShadowOptions {
	castShadow?: boolean
	receiveShadow?: boolean
}
export type BaseInitOptions = BaseControllerOptions
export type BaseUpdateOptions = BaseControllerOptions

export abstract class BaseController<T extends Object3D> extends EventDispatcher {
	public three!: T
	public name: BaseControllerOptions['name']
	protected scene: Scene

	constructor({ name }: Pick<BaseControllerOptions, 'name'>) {
		super()
		this.name = name
		this.scene = get(sceneStore)
	}

	protected abstract init(options: BaseInitOptions | PointsInitOptions): void

	public abstract update(
		options:
			| BaseUpdateOptions
			| MeshUpdateOptions
			| DirectionalLightUpdateOptions
			| PerspectiveCameraUpdateOptions
			| PointsUpdateOptions
	): void

	public abstract animate(animateFunction: AnimateFunction<T>): void

	protected isIntersected(): boolean {
		const raycasterIntersects = get(raycasterIntersectsStore)

		const intersected = raycasterIntersects.find(({ object }) => object.uuid === this.three.uuid)

		return intersected ? true : false
	}

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
}
